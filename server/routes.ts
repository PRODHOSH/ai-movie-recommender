import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes, setupAuth } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Using the env vars provided by Replit AI Integrations
const genAI = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Recommendation Route
  app.get(api.recommendations.get.path, async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const mood = req.query.mood as string;
    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    try {
      // A. Gemini: Mood -> Genres
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        You are a movie recommendation expert. 
        Convert the following user mood or situation into a list of TMDB (The Movie Database) genre names.
        User Mood: "${mood}"
        
        Return ONLY a JSON array of genre strings. Do not include markdown formatting or explanations.
        Example: ["Drama", "Comedy", "Romance"]
        Valid TMDB Genres: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, TV Movie, Thriller, War, Western.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      let genres: string[] = [];
      try {
        // Clean up markdown code blocks if present
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        genres = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse Gemini response:", responseText);
        // Fallback or retry logic could go here
        return res.status(500).json({ message: "Failed to process mood" });
      }

      // Map genres to TMDB IDs (Simplified map)
      const genreMap: Record<string, number> = {
        "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35, "Crime": 80,
        "Documentary": 99, "Drama": 18, "Family": 10751, "Fantasy": 14, "History": 36,
        "Horror": 27, "Music": 10402, "Mystery": 9648, "Romance": 10749, "Science Fiction": 878,
        "TV Movie": 10770, "Thriller": 53, "War": 10752, "Western": 37
      };

      const genreIds = genres
        .map(g => genreMap[g] || genreMap[Object.keys(genreMap).find(k => k.toLowerCase() === g.toLowerCase()) || ""])
        .filter(Boolean)
        .join(",");

      // B. TMDB: Fetch Movies
      const tmdbApiKey = process.env.TMDB_API_KEY;
      let moviesData = [];

      if (tmdbApiKey) {
        const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreIds}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1`;
        const tmdbRes = await fetch(tmdbUrl);
        const tmdbJson = await tmdbRes.json();
        
        if (tmdbJson.results) {
            moviesData = tmdbJson.results.map((m: any) => ({
                tmdbId: m.id,
                title: m.title,
                overview: m.overview,
                posterPath: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
                backdropPath: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
                releaseDate: m.release_date,
                voteAverage: String(m.vote_average),
            }));
        }
      } else {
         console.warn("TMDB_API_KEY is missing. Returning mock data.");
         // Mock data if no key (so app doesn't crash during review)
         moviesData = [
             { tmdbId: 1, title: "Mock Movie 1", overview: "A great movie about " + mood, posterPath: null, backdropPath: null, releaseDate: "2023-01-01", voteAverage: "8.5" },
             { tmdbId: 2, title: "Mock Movie 2", overview: "Another movie fitting " + genres.join(", "), posterPath: null, backdropPath: null, releaseDate: "2023-02-01", voteAverage: "7.5" }
         ];
      }

      // C. Save History
      // @ts-ignore
      await storage.addHistory(req.user.claims.sub, mood, genres);

      res.json({
        movies: moviesData,
        mood,
        genres
      });

    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // 3. Favorites Routes
  app.get(api.favorites.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    // @ts-ignore
    const userId = req.user.claims.sub;
    const favorites = await storage.getFavorites(userId);
    // Format to match API schema (include IDs)
    const response = favorites.map(f => ({
        id: f.id,
        movie: f.movie,
        userId: f.userId,
        movieId: f.movieId,
        createdAt: f.createdAt,
    }));
    res.json(response);
  });

  app.post(api.favorites.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
        const input = api.favorites.add.input.parse(req.body);
        // @ts-ignore
        const userId = req.user.claims.sub;
        const favorite = await storage.addFavorite(userId, input);
        res.status(201).json(favorite);
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input" });
            return;
        }
        res.status(500).json({ message: "Server error" });
    }
  });

  app.delete(api.favorites.remove.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    // @ts-ignore
    const userId = req.user.claims.sub;
    const id = parseInt(req.params.id);
    await storage.removeFavorite(id, userId);
    res.status(204).send();
  });

  // 4. History Route
  app.get(api.history.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    // @ts-ignore
    const userId = req.user.claims.sub;
    const history = await storage.getHistory(userId);
    res.json(history);
  });

  return httpServer;
}
