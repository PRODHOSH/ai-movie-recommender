import { useState } from "react";
import { useWatchlist, useRemoveFromWatchlist, useMovieDetails } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Bookmark, Loader2, Film, User, Clock, X, Youtube, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function WatchlistDetailModal({
  movie,
  onClose,
  onRemove,
}: {
  movie: any;
  onClose: () => void;
  onRemove: () => void;
}) {
  const { data: details, isLoading: detailsLoading } = useMovieDetails(movie?.tmdbId ?? null);
  const displayDetails = movie ? { ...movie, ...(details ?? {}) } : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-card border border-white/10 rounded-2xl shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Poster */}
          <div className="md:col-span-2 relative h-64 md:min-h-[500px]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r" />
          </div>

          {/* Details */}
          <div className="md:col-span-3 p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-white font-semibold">
                    {Number(movie.voteAverage).toFixed(1)}
                  </span>
                </span>
                {movie.releaseDate && <span>{movie.releaseDate.split("-")[0]}</span>}
                {displayDetails?.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {displayDetails.runtime} min
                  </span>
                )}
              </div>
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Overview</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{movie.overview}</p>
              </div>
            )}

            {detailsLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                {displayDetails?.director && (
                  <div className="flex items-start gap-2 text-sm">
                    <Film className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <span className="text-white font-medium">Director: </span>
                      <span className="text-muted-foreground">{displayDetails.director}</span>
                    </div>
                  </div>
                )}
                {displayDetails?.cast?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-muted-foreground" /> Cast
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                      {(displayDetails.cast as { name: string; character: string; profilePath: string | null }[]).map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 w-16">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10">
                            {c.profilePath
                              ? <img src={`https://image.tmdb.org/t/p/w185${c.profilePath}`} alt={c.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><User className="w-5 h-5 text-muted-foreground" /></div>
                            }
                          </div>
                          <span className="text-xs text-white text-center leading-tight line-clamp-2 w-full">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground text-center line-clamp-1 w-full">{c.character}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {displayDetails?.trailer && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  Trailer
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${(displayDetails.trailer as any).key}?rel=0`}
                    title="Movie Trailer"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Remove from watchlist */}
            <div className="pt-2">
              <button
                onClick={onRemove}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Remove from Watchlist
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WatchlistPage() {
  const { data: watchlist, isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selectedItem && (
          <WatchlistDetailModal
            movie={selectedItem}
            onClose={() => setSelectedItem(null)}
            onRemove={() => {
              const entry = watchlist?.find((w) => w.movie.tmdbId === selectedItem.tmdbId);
              if (entry) removeFromWatchlist.mutate(entry.id);
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Bookmark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            {watchlist?.length
              ? `${watchlist.length} movie${watchlist.length !== 1 ? "s" : ""} to watch`
              : "Your future movie nights start here"}
          </p>
        </div>
      </motion.div>

      {/* Empty state */}
      {(!watchlist || watchlist.length === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-card border border-white/10 flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Nothing saved yet</h2>
          <p className="text-muted-foreground max-w-sm">
            When you find a movie you want to watch later, click "Add to Watchlist" from the movie
            details modal.
          </p>
        </motion.div>
      )}

      {/* Grid */}
      {watchlist && watchlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {watchlist.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              <MovieCard
                movie={item.movie}
                delay={idx * 0.05}
                onClick={() => setSelectedItem(item.movie)}
              />
              {/* Quick remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist.mutate(item.id);
                }}
                className="absolute top-3 left-3 z-20 p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                title="Remove from watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
