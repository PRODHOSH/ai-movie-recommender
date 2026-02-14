import { useHistory } from "@/hooks/use-movies";
import { History, Clock, Sparkles, Loader2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();

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
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Search History
            </h1>
            <p className="text-muted-foreground mt-1">
              Your mood-based movie journey
            </p>
          </div>
        </div>
      </motion.div>

      {!history || history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-28 bg-gradient-to-br from-card/50 to-card/30 rounded-3xl border-2 border-dashed border-white/10 backdrop-blur-sm"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Clock className="relative w-16 h-16 text-primary mx-auto opacity-80" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">No history yet</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Start searching for movies by mood to see your journey here!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {history.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30">
                      <Sparkles className="w-3 h-3" />
                      MOOD SEARCH
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {entry.createdAt && format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-display font-bold text-white leading-tight">
                      "{entry.mood}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 md:justify-end max-w-md">
                  {(entry.generatedGenres as string[])?.map((genre, gIdx) => (
                    <motion.span
                      key={gIdx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08 + gIdx * 0.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 backdrop-blur-sm text-sm font-semibold text-white border border-white/10 hover:border-primary/30 transition-colors group-hover:bg-secondary"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500" />
                      {genre}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
