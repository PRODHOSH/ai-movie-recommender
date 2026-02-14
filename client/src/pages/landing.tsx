import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Footer } from "@/components/footer";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useTrendingMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);

  // Auto-rotate featured movie every 3 seconds
  useEffect(() => {
    if (!trendingMovies || trendingMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setFeaturedMovieIndex((prev) => (prev + 1) % Math.min(trendingMovies.length, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, [trendingMovies]);

  // Auto-scroll effect with improved infinite loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !trendingMovies?.length) return;

    let animationFrameId: number;
    let scrollPos = 0;
    const scrollSpeed = 1.5; // Increased speed
    
    const autoScroll = () => {
      if (scrollContainer) {
        scrollPos += scrollSpeed;
        
        const maxScroll = scrollContainer.scrollWidth / 2;
        
        // Reset to beginning seamlessly when halfway through
        if (scrollPos >= maxScroll) {
          scrollPos = 0;
        }
        
        scrollContainer.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    
    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trendingMovies]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Check your email for verification link.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setLocation("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden flex flex-col" style={{ background: '#000000' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] right-[15%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-[20%] left-[40%] w-[400px] h-[400px] bg-pink-600/30 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '4s'}} />
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full bg-black border-b border-white/10">
        <div className="flex items-center gap-2 text-primary">
          <img src="/favicon.png" alt="CINE-AI" className="w-9 h-9" />
          <span className="font-display font-bold text-2xl tracking-wide">CINE-AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setShowAuth(true); setIsSignUp(false); }}
            className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors backdrop-blur-sm"
          >
            Sign In
          </button>
          <button 
            onClick={() => { setShowAuth(true); setIsSignUp(true); }}
            className="px-6 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-sm font-semibold text-primary transition-colors backdrop-blur-sm"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowAuth(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-card to-card/95 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl"
          >
            {/* Close button */}
            <button 
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <img src="/favicon.png" alt="CINE-AI" className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{isSignUp ? 'Join CINE-AI' : 'Welcome Back'}</h2>
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Create an account to start discovering' : 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Google Sign In - Primary Option */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full mb-6 h-12 text-base font-semibold border-white/20 hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-xs text-muted-foreground font-medium">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-white/5 border-white/10 focus:border-primary/50"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 bg-white/5 border-white/10 focus:border-primary/50"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            {isSignUp && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedMovie(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card/95 border border-white/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            <div className="grid md:grid-cols-5 gap-0 h-full max-h-[90vh]">
              {/* Left: Movie Poster */}
              <div className="md:col-span-2 relative">
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={() => setSelectedMovie(null)}
                    className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <img
                  src={selectedMovie.posterPath ? `https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}` : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop"}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Movie Details */}
              <div className="md:col-span-3 p-8 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">{selectedMovie.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{Number(selectedMovie.voteAverage).toFixed(1)}</span>
                      </span>
                      <span>•</span>
                      <span>{selectedMovie.releaseDate?.split("-")[0] || "Unknown"}</span>
                      {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{selectedMovie.genres.slice(0, 2).join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMovie.overview || "No overview available."}
                    </p>
                  </div>

                  {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.genres.map((genre: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedMovie(null)}
                      className="w-full md:w-auto px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 md:px-12 max-w-7xl mx-auto pt-8 pb-12 md:pt-12 md:pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left: Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs md:text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Recommendations</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight leading-[1.15]">
              <span className="block text-white mb-2">Discover Movies</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
                That Match Your Mood
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
              Stop scrolling for hours. Tell us how you feel, and our AI will curate the perfect watchlist for your current vibe.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={() => { setShowAuth(true); setIsSignUp(true); }}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white text-base md:text-lg font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right: Rotating Featured Movie Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden md:flex justify-center items-center"
          >
            {trendingLoading ? (
              <div className="w-full max-w-md h-[550px] bg-card/30 rounded-2xl border border-white/10 animate-pulse" />
            ) : trendingMovies && trendingMovies.length > 0 && (
              <motion.div
                key={featuredMovieIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedMovie(trendingMovies[featuredMovieIndex])}
                className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] w-full max-w-md"
              >
                <div className="relative h-[550px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${trendingMovies[featuredMovieIndex].posterPath}`}
                    alt={trendingMovies[featuredMovieIndex].title}
                    className="w-full h-full object-cover"
                  />
                  {/* Enhanced gradient for maximum text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  
                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    {/* Top Trending Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/40 border-2 border-primary/80 backdrop-blur-xl shadow-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs font-bold uppercase tracking-wide">Top Trending #{featuredMovieIndex + 1}</span>
                    </div>
                    
                    {/* Movie Title */}
                    <h3 className="text-3xl font-black text-white leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)' }}>
                      {trendingMovies[featuredMovieIndex].title}
                    </h3>
                    
                    {/* Rating and Year */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-yellow-400/30">
                        <span className="text-yellow-400 text-base">★</span>
                        <span className="font-bold text-white">{trendingMovies[featuredMovieIndex].voteAverage?.toFixed(1) || 'N/A'}</span>
                      </div>
                      {trendingMovies[featuredMovieIndex].releaseDate && (
                        <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
                          <span className="font-bold text-white">{trendingMovies[featuredMovieIndex].releaseDate.split('-')[0]}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Genres */}
                    {trendingMovies[featuredMovieIndex].genres && trendingMovies[featuredMovieIndex].genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {trendingMovies[featuredMovieIndex].genres.slice(0, 3).map((genre: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-white/25 border border-white/50 text-white text-xs font-bold backdrop-blur-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Trending Movies Carousel */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/10 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-3">
              What's Hot This Week
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover what everyone's watching right now
            </p>
          </motion.div>

          {trendingLoading ? (
            <div className="flex gap-6 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-52 h-80 bg-card/30 rounded-2xl border border-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              {/* Straight horizontal scroll */}
              <div 
                ref={scrollRef}
                className="flex gap-8 overflow-x-hidden items-center py-8"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none'
                }}
              >
                {/* Duplicate movies 3 times for seamless infinite loop */}
                {trendingMovies && [...trendingMovies, ...trendingMovies, ...trendingMovies].map((movie, idx) => (
                  <motion.div
                    key={`${movie.tmdbId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx % 10) * 0.03 }}
                    className="flex-shrink-0 w-52 cursor-pointer"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <MovieCard movie={movie} delay={0} compact />
                  </motion.div>
                ))}
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10" />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
