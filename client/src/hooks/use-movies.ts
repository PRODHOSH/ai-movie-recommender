import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { tmdbClient, type TMDBMovie } from "@/lib/tmdb";
import { geminiClient } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  movieId: number;
  movie: Movie;
  createdAt: string;
}

export interface MoodHistory {
  id: string;
  userId: string;
  mood: string;
  genres: string[];
  createdAt: string;
}

function tmdbToMovie(tmdb: TMDBMovie, genreMap: Map<number, string>): Movie {
  return {
    id: tmdb.id,
    tmdbId: tmdb.id,
    title: tmdb.title,
    overview: tmdb.overview,
    posterPath: tmdb.poster_path,
    backdropPath: tmdb.backdrop_path,
    releaseDate: tmdb.release_date,
    voteAverage: tmdb.vote_average,
    genres: tmdb.genre_ids.map(id => genreMap.get(id) || 'Unknown'),
  };
}

// Recommendation Hook
export function useRecommendations(mood?: string) {
  return useQuery({
    queryKey: ["recommendations", mood],
    queryFn: async () => {
      if (!mood) return null;

      // Get available genres
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));

      // Get AI recommendations
      const recommendation = await geminiClient.getRecommendationsForMood(mood, genres);

      // Find genre IDs for recommended genres
      const genreIds = genres
        .filter(g => recommendation.genres.some(rg => 
          rg.toLowerCase() === g.name.toLowerCase()
        ))
        .map(g => g.id);

      // Fetch movies from TMDB
      const tmdbMovies = genreIds.length > 0
        ? await tmdbClient.getMoviesByGenre(genreIds)
        : await tmdbClient.getPopularMovies();

      const movies = tmdbMovies.slice(0, 12).map(m => tmdbToMovie(m, genreMap));

      // Save to history if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('mood_history').insert({
          user_id: session.user.id,
          mood,
          genres: recommendation.genres,
        });
      }

      return {
        movies,
        mood,
        genres: recommendation.genres,
        reasoning: recommendation.reasoning,
      };
    },
    enabled: !!mood,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Favorites Hooks
export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(fav => ({
        id: fav.id,
        userId: fav.user_id,
        movieId: fav.movie_id,
        movie: fav.movie_data,
        createdAt: fav.created_at,
      }));
    },
    enabled: !!user,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          movie_id: movie.tmdbId,
          movie_data: movie,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error("Already in favorites");
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Added to Favorites",
        description: "Movie saved to your collection.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Removed",
        description: "Movie removed from favorites.",
      });
    },
  });
}

// History Hook
export function useHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["history", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('mood_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map(h => ({
        id: h.id,
        userId: h.user_id,
        mood: h.mood,
        genres: h.genres || [],
        createdAt: h.created_at,
      }));
    },
    enabled: !!user,
  });
}
