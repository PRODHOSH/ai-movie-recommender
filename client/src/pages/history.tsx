import { useHistory } from "@/hooks/use-movies";
import { History, Clock, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-white/5">
        <History className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-display font-bold">Search History</h1>
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-3xl border border-white/5 border-dashed">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No history yet</h2>
          <p className="text-muted-foreground">
            Your mood-based searches will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
                    MOOD
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.createdAt && format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <p className="text-lg font-medium text-foreground">"{entry.mood}"</p>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end max-w-md">
                {(entry.generatedGenres as string[])?.map((genre, gIdx) => (
                  <span
                    key={gIdx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground border border-white/5"
                  >
                    <Sparkles className="w-3 h-3 text-primary" />
                    {genre}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
