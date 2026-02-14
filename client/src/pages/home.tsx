import { useState, useRef, useEffect } from "react";
import { useRecommendations, useTrendingMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Sparkles, Search, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [inputMood, setInputMood] = useState("");
  const [queryMood, setQueryMood] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  
  const { data, isLoading, isError } = useRecommendations(queryMood || undefined);
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies();

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollRef.current || !trendingMovies || trendingMovies.length === 0) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    let isPaused = false;

    const scroll = () => {
      if (!scrollRef.current || isPaused) {
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      scrollPosition += 0.8; // Smooth scroll speed
      
      const maxScroll = scrollRef.current.scrollWidth / 3; // Since we triple the movies
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollRef.current.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    const element = scrollRef.current;
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trendingMovies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMood.trim()) return;
    setQueryMood(inputMood);
  };

  return (
    <div className="space-y-12">
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

      {/* Hero / Input Section */}
      <section className="relative py-12 md:py-16 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white">
            What's Your Vibe?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your mood, and our AI will find the perfect movies for you
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMood}
              onChange={(e) => setInputMood(e.target.value)}
              placeholder="e.g., 'mind-bending sci-fi' or 'cozy Sunday vibes'"
              className="w-full h-16 pl-6 pr-36 rounded-xl bg-card border border-white/10 text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMood.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </section>

      {/* Trending Movies Section */}
      {!queryMood && (
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Trending This Week
              </h2>
            </div>
            <p className="text-muted-foreground">
              Discover what everyone's watching right now
            </p>
          </motion.div>

          {trendingLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-64 h-96 bg-card rounded-xl border border-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                }}
              >
                {trendingMovies && [...trendingMovies, ...trendingMovies, ...trendingMovies].map((movie, idx) => (
                  <motion.div
                    key={`${movie.tmdbId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx % 10) * 0.03 }}
                    onClick={() => setSelectedMovie(movie)}
                    className="flex-shrink-0 w-64 cursor-pointer"
                  >
                    <MovieCard movie={movie} delay={0} large />
                  </motion.div>
                ))}

              </div>
              
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            </div>
          )}
        </section>
      )}

      {/* Results Section */}
      <section className="space-y-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] bg-card rounded-xl border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="pb-4 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white mb-2">
                Recommended for You
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.movies.map((movie, idx) => (
                <MovieCard 
                  key={movie.tmdbId} 
                  movie={movie} 
                  delay={idx * 0.05}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>

            {data.movies.length === 0 && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No movies found. Try a different mood!</p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
