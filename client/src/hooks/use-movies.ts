import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { Movie, Favorite, MoodHistory, InsertMovie } from "@shared/schema";

// Recommendation Hook
export function useRecommendations(mood?: string) {
  return useQuery({
    queryKey: [api.recommendations.get.path, mood],
    queryFn: async () => {
      if (!mood) return null;
      // Convert spaces to URL params properly, though buildUrl/fetch handles query params usually
      const url = `${api.recommendations.get.path}?mood=${encodeURIComponent(mood)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      // Define return type matching the route response
      return (await res.json()) as {
        movies: Movie[];
        mood: string;
        genres: string[];
      };
    },
    enabled: !!mood,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Favorites Hooks
export function useFavorites() {
  return useQuery({
    queryKey: [api.favorites.list.path],
    queryFn: async () => {
      const res = await fetch(api.favorites.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return (await res.json()) as {
        id: number;
        movie: Movie;
        userId: string;
        movieId: number;
        createdAt: string;
      }[];
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movie: InsertMovie) => {
      const res = await fetch(api.favorites.add.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) throw new Error("Already in favorites");
        throw new Error("Failed to add favorite");
      }
      return (await res.json()) as Favorite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.favorites.list.path] });
      toast({
        title: "Added to Favorites",
        description: "Movie saved to your collection.",
      });
    },
    onError: (error) => {
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
    mutationFn: async (favoriteId: number) => {
      const url = buildUrl(api.favorites.remove.path, { id: favoriteId });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.favorites.list.path] });
      toast({
        title: "Removed",
        description: "Movie removed from favorites.",
      });
    },
  });
}

// History Hook
export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return (await res.json()) as MoodHistory[];
    },
  });
}
