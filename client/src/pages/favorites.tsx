import { useState } from "react";
import { useFavorites } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMovie(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-card border border-white/10 rounded-2xl shadow-2xl"
            >
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white transition-all"
              >
                ✕
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0 max-h-[90vh]">
                {/* Poster Section */}
                <div className="md:col-span-2 relative h-64 md:h-full min-h-[400px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Details Section */}
                <div className="md:col-span-3 p-8 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-white font-semibold">{selectedMovie.rating?.toFixed(1)}</span>
                        </div>
                        {selectedMovie.releaseYear && (
                          <span>{selectedMovie.releaseYear}</span>
                        )}
                        {selectedMovie.runtime && (
                          <span>{selectedMovie.runtime} min</span>
                        )}
                      </div>
                    </div>

                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.genres.map((genre: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {selectedMovie.overview && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedMovie.overview}
                        </p>
                      </div>
                    )}

                    {selectedMovie.director && (
                      <div>
                        <span className="text-sm font-semibold text-white">Director:</span>
                        <span className="text-sm text-muted-foreground ml-2">{selectedMovie.director}</span>
                      </div>
                    )}

                    {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-white">Cast:</span>
                        <span className="text-sm text-muted-foreground ml-2">{selectedMovie.cast.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <MovieCard 
                movie={fav.movie} 
                delay={0}
                onClick={() => setSelectedMovie(fav.movie)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
