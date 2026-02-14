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
    <div className="space-y-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Your Collection
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">
                Movies you've saved for later
              </p>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-sm font-bold text-primary">
                {favorites?.length || 0} {favorites?.length === 1 ? 'movie' : 'movies'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {!favorites || favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-28 bg-gradient-to-br from-card/50 to-card/30 rounded-3xl border-2 border-dashed border-white/10 backdrop-blur-sm"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">No favorites yet</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Start exploring and save movies you love to build your personal collection!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {favorites.map((fav, idx) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <MovieCard movie={fav.movie} delay={0} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
