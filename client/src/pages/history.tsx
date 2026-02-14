import { useState, useMemo } from "react";
import { useHistory } from "@/hooks/use-movies";
import { History, Clock, Loader2, Search, X } from "lucide-react";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!history) return [];
    if (!searchQuery.trim()) return history;
    
    const query = searchQuery.toLowerCase();
    return history.filter(entry => 
      entry.mood.toLowerCase().includes(query) ||
      (entry.generatedGenres as string[])?.some(genre => 
        genre.toLowerCase().includes(query)
      )
    );
  }, [history, searchQuery]);

  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: typeof history } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Older': []
    };

    filteredHistory.forEach(entry => {
      if (!entry.createdAt) {
        groups['Older'].push(entry);
        return;
      }
      
      const date = new Date(entry.createdAt);
      
      if (isToday(date)) {
        groups['Today'].push(entry);
      } else if (isYesterday(date)) {
        groups['Yesterday'].push(entry);
      } else if (isThisWeek(date)) {
        groups['This Week'].push(entry);
      } else if (isThisMonth(date)) {
        groups['This Month'].push(entry);
      } else {
        groups['Older'].push(entry);
      }
    });

    return groups;
  }, [filteredHistory]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <History className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-white">History</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-lg bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-32 bg-card/30 rounded-lg border border-white/5">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2 text-white">No history yet</h2>
          <p className="text-muted-foreground text-sm">
            Your mood searches will appear here
          </p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-32 bg-card/30 rounded-lg border border-white/5">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2 text-white">No results found</h2>
          <p className="text-muted-foreground text-sm">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([group, entries]) => {
            if (entries.length === 0) return null;
            
            return (
              <div key={group} className="space-y-3">
                {/* Group Header */}
                <h2 className="text-lg font-semibold text-white/80 px-2">{group}</h2>
                
                {/* History Items */}
                <div className="bg-card/50 border border-white/5 rounded-lg divide-y divide-white/5">
                  {entries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-4 p-4">
                        {/* Time */}
                        <div className="flex-shrink-0 w-16 pt-1">
                          <div className="text-xs text-muted-foreground">
                            {entry.createdAt && format(new Date(entry.createdAt), "h:mm a")}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Mood Query */}
                          <div className="flex items-start gap-2">
                            <Search className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-base text-white font-medium leading-relaxed">
                              {entry.mood}
                            </p>
                          </div>
                          
                          {/* Genres */}
                          {(entry.generatedGenres as string[])?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(entry.generatedGenres as string[]).map((genre, gIdx) => (
                                <span
                                  key={gIdx}
                                  className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary/90 border border-primary/20"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Full Date on Hover */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs text-muted-foreground">
                            {entry.createdAt && format(new Date(entry.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
