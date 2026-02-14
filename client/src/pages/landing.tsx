import { Sparkles, Film, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-primary">
          <Film className="w-8 h-8" />
          <span className="font-display font-bold text-2xl tracking-wide">CINE-AI</span>
        </div>
        <a 
          href="/api/login"
          className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors backdrop-blur-sm"
        >
          Sign In
        </a>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto">
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

          <div className="pt-8">
            <a
              href="/api/login"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
        
        {/* Abstract Floating Cards Visual */}
        <div className="relative w-full max-w-4xl h-64 mt-20 hidden md:block">
           <motion.div 
             initial={{ opacity: 0, rotate: -10, y: 100 }}
             animate={{ opacity: 0.5, rotate: -6, y: 0 }}
             transition={{ delay: 0.3, duration: 1 }}
             className="absolute left-10 top-0 w-48 h-72 bg-gray-800 rounded-2xl border border-white/10 shadow-2xl"
           />
           <motion.div 
             initial={{ opacity: 0, rotate: 10, y: 100 }}
             animate={{ opacity: 0.5, rotate: 6, y: 0 }}
             transition={{ delay: 0.5, duration: 1 }}
             className="absolute right-10 top-10 w-48 h-72 bg-gray-800 rounded-2xl border border-white/10 shadow-2xl"
           />
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 20 }}
             transition={{ delay: 0.7, duration: 1 }}
             className="absolute left-1/2 -translate-x-1/2 top-[-20px] w-56 h-80 bg-card rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center"
           >
             <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <div className="h-2 w-24 bg-white/10 rounded-full mx-auto mb-2" />
                <div className="h-2 w-16 bg-white/10 rounded-full mx-auto" />
             </div>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
