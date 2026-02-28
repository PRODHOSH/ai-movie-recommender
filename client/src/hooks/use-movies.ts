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

// Search Movies Hook
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: async () => {
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));
      const tmdbMovies = await tmdbClient.searchMovies(query);
      return tmdbMovies.slice(0, 20).map(m => tmdbToMovie(m, genreMap));
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
}

// Movie Details Hook (trailer, cast with photos, director, runtime, similar)
export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: ['movie-details', id],
    queryFn: async () => {
      if (!id) return null;
      const [details, credits, videos, similar] = await Promise.all([
        tmdbClient.getMovieDetails(id),
        tmdbClient.getMovieCredits(id),
        tmdbClient.getMovieVideos(id),
        tmdbClient.getSimilarMovies(id),
      ]);
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));
      const director = credits.crew.find(c => c.job === 'Director')?.name ?? null;
      const cast = credits.cast.slice(0, 8).map(c => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      }));
      const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ?? null;
      const similarMovies = similar.slice(0, 6).map(m => tmdbToMovie(m, genreMap));
      return { runtime: details.runtime, budget: details.budget, revenue: details.revenue, director, cast, trailer, similarMovies };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

// Trending Movies Hook
export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trending-movies"],
    queryFn: async () => {
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));
      
      const tmdbMovies = await tmdbClient.getTrendingMovies('week');
      return tmdbMovies.slice(0, 10).map(m => tmdbToMovie(m, genreMap));
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - trending doesn't change that fast
  });
}

// Now Playing Hook
export function useNowPlayingMovies() {
  return useQuery({
    queryKey: ['now-playing'],
    queryFn: async () => {
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));
      const tmdbMovies = await tmdbClient.getNowPlayingMovies();
      return tmdbMovies.slice(0, 12).map(m => tmdbToMovie(m, genreMap));
    },
    staleTime: 1000 * 60 * 60,
  });
}

// Top Rated Hook
export function useTopRatedMovies() {
  return useQuery({
    queryKey: ['top-rated'],
    queryFn: async () => {
      const genres = await tmdbClient.getGenres();
      const genreMap = new Map(genres.map(g => [g.id, g.name]));
      const tmdbMovies = await tmdbClient.getTopRatedMovies();
      return tmdbMovies.slice(0, 12).map(m => tmdbToMovie(m, genreMap));
    },
    staleTime: 1000 * 60 * 60,
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
// Watchlist interface
export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  movie: Movie;
  createdAt: string;
}

export function useWatchlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        movieId: item.movie_id,
        movie: item.movie_data as Movie,
        createdAt: item.created_at,
      })) as WatchlistItem[];
    },
    enabled: !!user,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (movie: Movie) => {
      if (!user) throw new Error('Must be logged in');
      const { data, error } = await supabase
        .from('watchlist')
        .insert({ user_id: user.id, movie_id: movie.tmdbId, movie_data: movie })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') throw new Error('Already in watchlist');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({ title: 'Added to Watchlist', description: 'Movie saved to your watchlist.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (watchlistId: string) => {
      const { error } = await supabase.from('watchlist').delete().eq('id', watchlistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({ title: 'Removed', description: 'Movie removed from watchlist.' });
    },
  });
}