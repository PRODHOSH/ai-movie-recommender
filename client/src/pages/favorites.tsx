import { useFavorites } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="w-6 h-6 text-primary fill-primary" />
        <h1 className="text-3xl font-display font-bold text-white">Your Favorites</h1>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/20">
          {favorites?.length || 0}
        </span>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-32 bg-card rounded-xl border border-white/5">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-white">No favorites yet</h2>
          <p className="text-muted-foreground">
            Start saving movies you love!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav, idx) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <MovieCard movie={fav.movie} delay={0} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
