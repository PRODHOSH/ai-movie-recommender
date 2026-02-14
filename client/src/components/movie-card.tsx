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
}

export function MovieCard({ movie, delay = 0, compact = false, large = false }: MovieCardProps) {
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
        className="group relative bg-card rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl hover:shadow-primary/30 border border-white/10 hover:border-primary/50 transition-all duration-500 hover:scale-105"
      >
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          <button
            onClick={handleToggleFavorite}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="absolute top-4 right-4 z-20 p-3 rounded-full glass hover:bg-white/30 transition-all duration-200 active:scale-95 backdrop-blur-xl"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>

          <div className="absolute top-4 left-4 z-20 px-3 py-2 rounded-full glass backdrop-blur-xl flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-white">
              {Number(movie.voteAverage).toFixed(1)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 space-y-2">
            <h3 className="font-display font-black text-xl leading-tight text-white line-clamp-2 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <span className="font-semibold">{movie.releaseDate?.split("-")[0] || "Unknown"}</span>
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="text-white/80">{movie.genres[0]}</span>
                </>
              )}
            </div>
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
        className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/20 border border-white/5 hover:border-primary/50 transition-all duration-300"
      >
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <button
            onClick={handleToggleFavorite}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="absolute top-2 right-2 z-20 p-2 rounded-full glass hover:bg-white/20 transition-all duration-200 active:scale-95"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors duration-300",
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>

          <div className="absolute top-2 left-2 z-20 px-2 py-1 rounded-full glass flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">
              {Number(movie.voteAverage).toFixed(1)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
            <h3 className="font-display font-bold text-sm leading-tight text-white line-clamp-2">
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
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 border border-white/5 hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="aspect-[2/3] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Top Right Action */}
        <button
          onClick={handleToggleFavorite}
          disabled={addFavorite.isPending || removeFavorite.isPending}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-full glass hover:bg-white/20 transition-all duration-200 active:scale-95"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-300",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full glass flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">
            {Number(movie.voteAverage).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{movie.releaseDate?.split("-")[0] || "Unknown"}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {movie.overview}
        </p>
      </div>
    </motion.div>
  );
}
