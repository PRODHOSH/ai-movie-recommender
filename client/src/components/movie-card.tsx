import { Heart, Star, Calendar } from "lucide-react";
import { Movie, InsertMovie } from "@shared/schema";
import { useAddFavorite, useRemoveFavorite, useFavorites } from "@/hooks/use-movies";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  delay?: number;
}

export function MovieCard({ movie, delay = 0 }: MovieCardProps) {
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
      // Prepare insert object (omit id)
      const movieToInsert: InsertMovie = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
      };
      addFavorite.mutate(movieToInsert);
    }
  };

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop"; // Abstract cinema fallback

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
