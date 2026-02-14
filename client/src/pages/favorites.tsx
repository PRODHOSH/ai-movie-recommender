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
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-white/5">
        <Heart className="w-6 h-6 text-primary fill-primary" />
        <h1 className="text-3xl font-display font-bold">Your Collection</h1>
        <span className="px-3 py-1 rounded-full bg-white/5 text-sm font-medium text-muted-foreground">
          {favorites?.length || 0}
        </span>
      </div>

      {!favorites || favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-card/50 rounded-3xl border border-white/5 border-dashed"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Start exploring and save movies you love to build your personal collection.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {favorites.map((fav, idx) => (
            <MovieCard key={fav.id} movie={fav.movie} delay={idx * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
