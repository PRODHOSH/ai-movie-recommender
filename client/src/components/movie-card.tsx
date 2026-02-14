import { Heart, Star, Calendar } from "lucide-react";
import type { Movie } from "@/hooks/use-movies";
import { useAddFavorite, useRemoveFavorite, useFavorites } from "@/hooks/use-movies";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  delay?: number;
  compact?: boolean;
  large?: boolean;
  onClick?: () => void;
}

export function MovieCard({ movie, delay = 0, compact = false, large = false, onClick }: MovieCardProps) {
  const { data: favorites } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  // Find if this specific movie is favorited
  // In the recommendations, movie.tmdbId is populated.
  // In favorites list, we usually get the favorite ID, but here we just check presence by tmdbId.
  const favoriteEntry = favorites?.find((f) => f.movie.tmdbId === movie.tmdbId);
  const isFavorite = !!favoriteEntry;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite && favoriteEntry) {
      removeFavorite.mutate(favoriteEntry.id);
    } else {
      addFavorite.mutate(movie);
    }
  };

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop";

  // Large variant for trending section
  if (large) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        onClick={onClick}
        className="group relative bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <button
            onClick={handleToggleFavorite}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>

          <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">
              {Number(movie.voteAverage).toFixed(1)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
            <h3 className="font-display font-bold text-lg text-white line-clamp-2">
              {movie.title}
            </h3>
            <span className="text-sm text-white/80 mt-1 block">
              {movie.releaseDate?.split("-")[0] || "Unknown"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        onClick={onClick}
        className="group relative bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
      >
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <button
            onClick={handleToggleFavorite}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>

          <div className="absolute top-2 left-2 z-20 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">
              {Number(movie.voteAverage).toFixed(1)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
            <h3 className="font-display font-bold text-sm text-white line-clamp-2">
              {movie.title}
            </h3>
            <span className="text-xs text-white/70 mt-1 block">
              {movie.releaseDate?.split("-")[0] || "Unknown"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onClick={onClick}
      className="group relative bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col cursor-pointer"
    >
      <div className="aspect-[2/3] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        <button
          onClick={handleToggleFavorite}
          disabled={addFavorite.isPending || removeFavorite.isPending}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>

        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">
            {Number(movie.voteAverage).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-card">
        <h3 className="font-display font-bold text-base text-white line-clamp-1 mb-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{movie.releaseDate?.split("-")[0] || "Unknown"}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {movie.overview}
        </p>
      </div>
    </motion.div>
  );
}
