import { useState, useRef, useEffect } from "react";
import { useRecommendations, useTrendingMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import { Sparkles, Search, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [inputMood, setInputMood] = useState("");
  const [queryMood, setQueryMood] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
    <div className="space-y-16">
      {/* Trending Movies Section - Always at top for signed in users */}
      {!queryMood && (
        <section className="relative -mt-8 -mx-4 md:-mx-8 lg:-mx-12">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 px-4 md:px-8 lg:px-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-primary text-sm font-bold mb-4">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                What's Hot This Week
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                Discover what everyone's watching right now
              </p>
            </motion.div>

            {trendingLoading ? (
              <div className="flex gap-6 overflow-hidden px-4 md:px-8 lg:px-12">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-72 h-96 bg-card/50 rounded-2xl border border-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <div 
                  ref={scrollRef}
                  className="flex gap-8 overflow-x-hidden px-4 md:px-8 lg:px-12"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                  }}
                >
                  {/* Triple the movies for seamless infinite loop */}
                  {trendingMovies && [...trendingMovies, ...trendingMovies, ...trendingMovies].map((movie, idx) => (
                    <motion.div
                      key={`${movie.tmdbId}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (idx % 10) * 0.03 }}
                      className="flex-shrink-0 w-72"
                    >
                      <MovieCard movie={movie} delay={0} compact={false} large />
                    </motion.div>
                  ))}
                </div>
                
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero / Input Section - "What's Your Vibe" */}
      <section className="relative py-16 md:py-20 max-w-5xl mx-auto text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-3xl opacity-20" />
            <h1 className="relative text-5xl md:text-7xl font-display font-black tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-400">
                What's Your Vibe?
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Describe your mood, situation, or what you're craving.<br />
            <span className="text-primary font-medium">Our AI</span> will match you with the perfect cinematic experience.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMood}
                onChange={(e) => setInputMood(e.target.value)}
                placeholder="e.g., 'I want a mind-bending sci-fi' or 'Lazy rainy Sunday vibes'"
                className="w-full h-20 pl-8 pr-40 rounded-2xl bg-gradient-to-r from-secondary/80 to-secondary/50 backdrop-blur-xl border-2 border-white/10 text-xl placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:bg-secondary/90 transition-all duration-300 shadow-2xl"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMood.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold text-lg flex items-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Find Movies</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </section>

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
