import { Sparkles, Film, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();

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
          <Film className="w-8 h-8" />
          <span className="font-display font-bold text-2xl tracking-wide">CINE-AI</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="/api/login"
            className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors backdrop-blur-sm"
          >
            Sign In
          </a>
          <a 
            href="/api/login"
            className="px-6 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-sm font-semibold text-primary transition-colors backdrop-blur-sm"
          >
            Demo Login
          </a>
        </div>
      </nav>

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
            <a
              href="/api/login"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
        
        {/* Visual Showcase */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl opacity-50">
           {[
             "https://image.tmdb.org/t/p/w500/8Gxv8Z7R9G9tuz97I3ORv2Lyd9n.jpg",
             "https://image.tmdb.org/t/p/w500/q719jsmZcy61BDs616C0p9gJmOq.jpg",
             "https://image.tmdb.org/t/p/w500/t6SnaqvihT2uB9vSlpS1iQClS8S.jpg",
             "https://image.tmdb.org/t/p/w500/ldfCF96R1NNmIoeH0rSTpZaqTvS.jpg"
           ].map((src, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * i, duration: 0.5 }}
               className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10"
             >
               <img src={src} alt="Movie Poster" className="w-full h-full object-cover" />
             </motion.div>
           ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Film className="w-6 h-6" />
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
