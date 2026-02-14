import { useHistory } from "@/hooks/use-movies";
import { History, Clock, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-display font-bold text-white">Search History</h1>
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-32 bg-card rounded-xl border border-white/5">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-white">No history yet</h2>
          <p className="text-muted-foreground">
            Your mood searches will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-white/10 hover:border-primary/30 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {entry.createdAt && format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
                <p className="text-lg font-medium text-white">"{entry.mood}"</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(entry.generatedGenres as string[])?.map((genre, gIdx) => (
                  <span
                    key={gIdx}
                    className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary border border-primary/20"
                  >
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
