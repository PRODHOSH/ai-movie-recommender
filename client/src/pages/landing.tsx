import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
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

  // Auto-scroll effect with improved infinite loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !trendingMovies?.length) return;

    let animationFrameId: number;
    let scrollPos = 0;
    const scrollSpeed = 1; // pixels per frame
    
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
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

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Recommendations</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1]">
            <span className="block text-white">Discover Movies</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
              Matches Your Mood
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop scrolling for hours. Tell us how you feel, and our AI will curate the perfect watchlist for your current vibe.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { setShowAuth(true); setIsSignUp(true); }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Trending Movies Carousel with Curved Design */}
      <section className="relative py-20 overflow-hidden">
        {/* Curved background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <svg className="absolute top-0 left-0 w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              className="text-background"
              d="M0,0 C480,100 960,100 1440,0 L1440,120 L0,120 Z"
            />
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              className="text-background"
              d="M0,120 C480,20 960,20 1440,120 L1440,0 L0,0 Z"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
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
            <div className="relative">
              <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden scroll-smooth py-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Duplicate movies 3 times for seamless infinite loop */}
                {trendingMovies && [...trendingMovies, ...trendingMovies, ...trendingMovies].map((movie, idx) => (
                  <motion.div
                    key={`${movie.tmdbId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx % 10) * 0.03 }}
                    className="flex-shrink-0 w-52"
                    style={{
                      animation: `wave 3s ease-in-out infinite`,
                      animationDelay: `${idx * 0.2}s`
                    }}
                  >
                    <MovieCard movie={movie} delay={0} compact />
                  </motion.div>
                ))}
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            </div>
          )}
        </div>

        {/* CSS for wave animation */}
        <style>{`
          @keyframes wave {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-15px) rotate(2deg);
            }
            50% {
              transform: translateY(-25px) rotate(0deg);
            }
            75% {
              transform: translateY(-15px) rotate(-2deg);
            }
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <img src="/favicon.png" alt="CINE-AI" className="w-7 h-7" />
              <span className="font-display font-bold text-xl tracking-wide">CINE-AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Revolutionizing movie discovery through the power of artificial intelligence. Find your next favorite film in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Discover</a></li>
                <li><a href="/favorites" className="hover:text-primary transition-colors">Favorites</a></li>
                <li><a href="/history" className="hover:text-primary transition-colors">History</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Powered By</h4>
            <div className="flex gap-4">
              <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium">Gemini AI</div>
              <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium">TMDB API</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
          © 2026 CINE-AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
