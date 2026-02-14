import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  movies,
  favorites,
  moodHistory,
  type Movie,
  type InsertMovie,
  type Favorite,
  type MoodHistory,
  users,
} from "@shared/schema";

export interface IStorage {
  // User
  getUser(id: string): Promise<typeof users.$inferSelect | undefined>;
  
  // Movies
  getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // Favorites
  getFavorites(userId: string): Promise<(Favorite & { movie: Movie })[]>;
  addFavorite(userId: string, movie: InsertMovie): Promise<Favorite>;
  removeFavorite(id: number, userId: string): Promise<void>;
  
  // History
  getHistory(userId: string): Promise<MoodHistory[]>;
  addHistory(userId: string, mood: string, genres: any): Promise<MoodHistory>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.tmdbId, tmdbId));
    return movie;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db.insert(movies).values(insertMovie).returning();
    return movie;
  }

  async getFavorites(userId: string): Promise<(Favorite & { movie: Movie })[]> {
    const results = await db
      .select({
        favorite: favorites,
        movie: movies,
      })
      .from(favorites)
      .innerJoin(movies, eq(favorites.movieId, movies.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return results.map((r) => ({ ...r.favorite, movie: r.movie }));
  }

  async addFavorite(userId: string, insertMovie: InsertMovie): Promise<Favorite> {
    // 1. Ensure movie exists
    let movie = await this.getMovieByTmdbId(insertMovie.tmdbId);
    if (!movie) {
      movie = await this.createMovie(insertMovie);
    }

    // 2. Check if favorite already exists
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.movieId, movie.id)));

    if (existing) {
      return existing;
    }

    // 3. Create favorite
    const [favorite] = await db
      .insert(favorites)
      .values({
        userId,
        movieId: movie.id,
      })
      .returning();

    return favorite;
  }

  async removeFavorite(id: number, userId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.id, id), eq(favorites.userId, userId)));
  }

  async getHistory(userId: string): Promise<MoodHistory[]> {
    return db
      .select()
      .from(moodHistory)
      .where(eq(moodHistory.userId, userId))
      .orderBy(desc(moodHistory.createdAt));
  }

  async addHistory(userId: string, mood: string, genres: any): Promise<MoodHistory> {
    const [history] = await db
      .insert(moodHistory)
      .values({
        userId,
        mood,
        generatedGenres: genres,
      })
      .returning();
    return history;
  }
}

export const storage = new DatabaseStorage();
