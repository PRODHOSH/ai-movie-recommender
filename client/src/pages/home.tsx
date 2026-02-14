import { useState } from "react";
import { useRecommendations, useTrendingMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Sparkles, Search, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [inputMood, setInputMood] = useState("");
  const [queryMood, setQueryMood] = useState("");
  
  const { data, isLoading, isError } = useRecommendations(queryMood || undefined);
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMood.trim()) return;
    setQueryMood(inputMood);
  };

  return (
    <div className="space-y-12">
      {/* Hero / Input Section */}
      <section className="relative py-12 md:py-20 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            What's your vibe today?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your mood, situation, or what you're craving. Our AI will match you with the perfect cinematic experience.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMood}
                onChange={(e) => setInputMood(e.target.value)}
                placeholder="e.g., 'I want a mind-bending sci-fi that makes me think' or 'Lazy rainy Sunday'"
                className="w-full h-16 pl-6 pr-32 rounded-full bg-secondary/50 border border-white/10 text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-secondary/80 transition-all duration-300 shadow-xl"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMood.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Inspire Me</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </section>

      {/* Trending Movies Section with Curved Design */}
      {!queryMood && (
        <section className="relative py-16 -mx-4 md:-mx-8 lg:-mx-12">
          {/* Curved background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent">
            <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path 
                fill="currentColor" 
                className="text-background"
                d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z"
              />
            </svg>
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path 
                fill="currentColor" 
                className="text-background"
                d="M0,120 C480,0 960,0 1440,120 L1440,0 L0,0 Z"
              />
            </svg>
          </div>

          <div className="relative px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                What's Hot This Week
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover what everyone's watching right now
              </p>
            </motion.div>

            {trendingLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-48 h-72 bg-card/50 rounded-2xl border border-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                  {trendingMovies?.map((movie, idx) => (
                    <motion.div
                      key={movie.tmdbId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="flex-shrink-0 w-48"
                    >
                      <MovieCard movie={movie} delay={0} compact />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="space-y-8 min-h-[400px]">
        {/* Loading State Skeleton is implied by isLoading check above for button, but let's add a visual area loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[500px] bg-card/50 rounded-2xl border border-white/5" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Something went wrong fetching recommendations. Please try again.</p>
          </div>
        )}

        {/* Success State */}
        {data && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Analysis Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white mb-2">
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
                <div className="text-right hidden md:block">
                  <span className="text-sm text-muted-foreground block">Based on</span>
                  <span className="text-sm font-medium text-white italic">"{data.mood}"</span>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {data.movies.map((movie, idx) => (
                  <MovieCard key={movie.tmdbId} movie={movie} delay={idx * 0.1} />
                ))}
              </div>

              {data.movies.length === 0 && (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No movies found for this mood. Try something else!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {!data && !isLoading && !isError && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50 space-y-4">
            <FilmStripIcon className="w-24 h-24 opacity-20" />
            <p>Ready to find your next favorite film?</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilmStripIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}
