import { useState, useRef, useEffect } from "react";
import {
  useRecommendations,
  useTrendingMovies,
  useSearchMovies,
  useMovieDetails,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  type Movie,
} from "@/hooks/use-movies";
import { MovieCard } from "@/components/movie-card";
import {
  Sparkles,
  Search,
  Loader2,
  TrendingUp,
  Shuffle,
  Film,
  User,
  Clock,
  X,
  Bookmark,
  Filter,
  Play,
  Star,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SURPRISE_MOODS = [
  "mind-bending sci-fi thriller",
  "cozy Sunday afternoon vibes",
  "epic fantasy adventure",
  "heartwarming romantic comedy",
  "edge-of-your-seat horror",
  "inspiring true story",
  "classic 80s nostalgia",
  "laugh-out-loud comedy night",
  "dark psychological mystery",
  "action-packed blockbuster",
  "feel-good animated family film",
  "gripping crime drama",
];

const QUICK_MOODS = [
  { label: "🔥 Action", value: "explosive action blockbuster" },
  { label: "💀 Horror", value: "terrifying horror nightmare" },
  { label: "😂 Comedy", value: "hilarious laugh-out-loud comedy" },
  { label: "💕 Romance", value: "heartwarming romantic love story" },
  { label: "🚀 Sci-Fi", value: "mind-bending futuristic sci-fi" },
  { label: "🕵️ Mystery", value: "gripping dark psychological mystery" },
  { label: "🎭 Drama", value: "powerful emotional drama" },
  { label: "🧙 Fantasy", value: "epic magical fantasy world" },
];

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
];

export default function HomePage() {
  const [mode, setMode] = useState<"mood" | "search">("mood");
  const [inputMood, setInputMood] = useState("");
  const [queryMood, setQueryMood] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [heroIndex, setHeroIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useRecommendations(queryMood || undefined);
  const { data: searchResults, isLoading: searchLoading } = useSearchMovies(activeSearch);
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies();
  const { data: movieDetails, isLoading: detailsLoading } = useMovieDetails(
    selectedMovie?.tmdbId ?? null
  );
  const { data: watchlist } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Auto-rotate hero movie every 6s when idle
  useEffect(() => {
    if (!trendingMovies?.length || queryMood || activeSearch) return;
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % Math.min(5, trendingMovies.length)), 6000);
    return () => clearInterval(timer);
  }, [trendingMovies, queryMood, activeSearch]);

  // Auto-scroll trending strip
  useEffect(() => {
    if (!scrollRef.current || !trendingMovies || trendingMovies.length === 0) return;
    let animationFrameId: number;
    let scrollPosition = 0;
    let isPaused = false;
    const scroll = () => {
      if (!scrollRef.current || isPaused) { animationFrameId = requestAnimationFrame(scroll); return; }
      scrollPosition += 0.8;
      const maxScroll = scrollRef.current.scrollWidth / 3;
      if (scrollPosition >= maxScroll) scrollPosition = 0;
      scrollRef.current.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
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
    if (mode === "mood") {
      if (!inputMood.trim()) return;
      setQueryMood(inputMood);
    } else {
      if (!searchQuery.trim()) return;
      setActiveSearch(searchQuery);
    }
  };

  const handleSurpriseMe = () => {
    const randomMood = SURPRISE_MOODS[Math.floor(Math.random() * SURPRISE_MOODS.length)];
    setMode("mood");
    setInputMood(randomMood);
    setQueryMood(randomMood);
  };

  const handleQuickMood = (value: string) => {
    setMode("mood");
    setInputMood(value);
    setQueryMood(value);
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const currentMovies = mode === "search" ? searchResults : data?.movies;
  const currentLoading = mode === "search" ? searchLoading : isLoading;
  const hasQuery = mode === "search" ? activeSearch.length > 2 : !!queryMood;

  const filteredMovies = (currentMovies ?? [])
    .filter((movie) => {
      if (selectedGenres.length === 0 && !yearFrom && !yearTo) return true;
      const movieYear = Number(movie.releaseDate?.split("-")[0]);
      if (yearFrom && movieYear < Number(yearFrom)) return false;
      if (yearTo && movieYear > Number(yearTo)) return false;
      if (
        selectedGenres.length > 0 &&
        !movie.genres.some((g) =>
          selectedGenres.some((sid) => GENRES.find((gen) => gen.id === sid)?.name === g)
        )
      ) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "vote_average.desc") return b.voteAverage - a.voteAverage;
      if (sortBy === "primary_release_date.desc") return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (sortBy === "primary_release_date.asc") return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      return 0;
    });

  const isInWatchlist = (tmdbId: number) => watchlist?.some((w) => w.movie.tmdbId === tmdbId) ?? false;
  const getWatchlistEntry = (tmdbId: number) => watchlist?.find((w) => w.movie.tmdbId === tmdbId);
  const displayDetails = selectedMovie ? { ...selectedMovie, ...(movieDetails ?? {}) } : null;
  const activeFilterCount = selectedGenres.length + (yearFrom ? 1 : 0) + (yearTo ? 1 : 0);
  const heroMovie = trendingMovies?.[heroIndex] ?? null;
  const showHomeSections = !queryMood && !activeSearch;

  return (
    <div className="space-y-10">

      {/* ── Movie Detail Modal ── */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedMovie(null); setShowTrailer(false); }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0e0e0e] border border-white/8 sm:rounded-2xl rounded-t-2xl shadow-2xl"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Backdrop / Poster header */}
              <div className="relative h-52 sm:h-64 overflow-hidden sm:rounded-t-2xl rounded-t-2xl">
                <img
                  src={selectedMovie.backdropPath
                    ? `https://image.tmdb.org/t/p/w780${selectedMovie.backdropPath}`
                    : `https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-black/40 to-transparent" />
                {/* Close */}
                <button
                  onClick={() => { setSelectedMovie(null); setShowTrailer(false); }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {/* Poster thumbnail bottom-left */}
                <div className="absolute -bottom-10 left-5 w-[72px] h-[108px] rounded-xl overflow-hidden border-2 border-white/10 shadow-xl">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${selectedMovie.posterPath}`}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Body */}
              <div className="px-5 pb-6 pt-12 space-y-5">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white leading-snug">{selectedMovie.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{Number(selectedMovie.voteAverage).toFixed(1)}</span>
                      </span>
                      {selectedMovie.releaseDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{selectedMovie.releaseDate.split("-")[0]}
                        </span>
                      )}
                      {displayDetails?.runtime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{displayDetails.runtime} min
                        </span>
                      )}
                      {displayDetails?.director && (
                        <span className="flex items-center gap-1">
                          <Film className="w-3 h-3" />{displayDetails.director}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Watchlist btn */}
                  <button
                    onClick={() => {
                      const entry = getWatchlistEntry(selectedMovie.tmdbId);
                      if (entry) removeFromWatchlist.mutate(entry.id);
                      else addToWatchlist.mutate(selectedMovie);
                    }}
                    disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                      isInWatchlist(selectedMovie.tmdbId)
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${ isInWatchlist(selectedMovie.tmdbId) ? "fill-primary" : "" }`} />
                    <span className="text-[10px] font-medium">{isInWatchlist(selectedMovie.tmdbId) ? "Saved" : "Save"}</span>
                  </button>
                </div>

                {/* Genre chips */}
                {selectedMovie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMovie.genres.map((genre: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/60 border border-white/8">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {selectedMovie.overview && (
                  <p className="text-sm text-white/70 leading-relaxed">{selectedMovie.overview}</p>
                )}

                {/* Cast */}
                {detailsLoading ? (
                  <div className="flex gap-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex-shrink-0 w-14 space-y-1.5">
                        <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse mx-auto" />
                        <div className="h-2.5 bg-white/5 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : displayDetails?.cast?.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Cast</p>
                    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {(displayDetails.cast as { name: string; character: string; profilePath: string | null }[]).map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-14 text-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10">
                            {c.profilePath
                              ? <img src={`https://image.tmdb.org/t/p/w185${c.profilePath}`} alt={c.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><User className="w-4 h-4 text-white/30" /></div>
                            }
                          </div>
                          <span className="text-[11px] text-white/80 leading-tight line-clamp-2">{c.name}</span>
                          <span className="text-[10px] text-white/35 line-clamp-1">{c.character}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Trailer */}
                {displayDetails?.trailer && (
                  <div>
                    {showTrailer ? (
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${(displayDetails.trailer as any).key}?rel=0&autoplay=1`}
                          title="Movie Trailer"
                          allowFullScreen
                          allow="autoplay"
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 text-white text-sm font-medium transition-all group"
                      >
                        <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </span>
                        Watch Trailer
                      </button>
                    )}
                  </div>
                )}

                {/* Similar Movies */}
                {displayDetails?.similarMovies?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">More Like This</p>
                    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {(displayDetails.similarMovies as any[]).map((m) => (
                        <motion.div
                          key={m.tmdbId}
                          whileHover={{ scale: 1.04 }}
                          onClick={() => { setSelectedMovie(m); setShowTrailer(false); }}
                          className="flex-shrink-0 w-[72px] cursor-pointer group"
                        >
                          <div className="rounded-lg overflow-hidden aspect-[2/3] bg-white/5 ring-1 ring-white/5 group-hover:ring-primary/40 transition-all">
                            <img
                              src={`https://image.tmdb.org/t/p/w185${m.posterPath}`}
                              alt={m.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                          <p className="text-[11px] text-white/60 mt-1.5 line-clamp-2 leading-tight group-hover:text-white transition-colors">{m.title}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cinematic Hero Banner ── */}
      <AnimatePresence mode="wait">
        {showHomeSections && heroMovie && heroMovie.backdropPath && (
          <motion.section
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative -mx-4 md:-mx-8 lg:-mx-12 h-[58vh] min-h-[380px] overflow-hidden rounded-2xl"
          >
            <img
              src={`https://image.tmdb.org/t/p/w1280${heroMovie.backdropPath}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Hero content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4 max-w-xl">
              <div className="flex flex-wrap gap-2">
                {heroMovie.genres?.slice(0, 3).map((g: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                    {g}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight drop-shadow-lg">
                {heroMovie.title}
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="font-bold text-white">{Number(heroMovie.voteAverage).toFixed(1)}</span>
                </span>
                {heroMovie.releaseDate && (
                  <span className="text-white/60">{heroMovie.releaseDate.split("-")[0]}</span>
                )}
              </div>
              {heroMovie.overview && (
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2 max-w-md">
                  {heroMovie.overview}
                </p>
              )}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => { setSelectedMovie(heroMovie); setShowTrailer(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all"
                >
                  <Play className="w-4 h-4 fill-black" /> Watch Trailer
                </button>
                <button
                  onClick={() => {
                    const entry = getWatchlistEntry(heroMovie.tmdbId);
                    if (entry) removeFromWatchlist.mutate(entry.id);
                    else addToWatchlist.mutate(heroMovie);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                    isInWatchlist(heroMovie.tmdbId)
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchlist(heroMovie.tmdbId) ? "fill-primary" : ""}`} />
                  {isInWatchlist(heroMovie.tmdbId) ? "Saved" : "Watchlist"}
                </button>
              </div>
            </div>

            {/* Hero dot indicators */}
            {trendingMovies && trendingMovies.length > 1 && (
              <div className="absolute bottom-6 right-8 flex gap-2">
                {trendingMovies.slice(0, 8).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === heroIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Search / Mood Input Section ── */}
      <section className="relative py-8 max-w-4xl mx-auto text-center space-y-6">
        {!showHomeSections && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
              {mode === "mood" ? "What's Your Vibe?" : "Find a Movie"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "mood" ? "Let AI read your mood and recommend perfect picks" : "Search any title in our catalog"}
            </p>
          </motion.div>
        )}

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setMode("mood")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "mood" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" /> AI Mood
            </button>
            <button
              onClick={() => setMode("search")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "search" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" /> Search Title
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={mode === "mood" ? inputMood : searchQuery}
              onChange={(e) => mode === "mood" ? setInputMood(e.target.value) : setSearchQuery(e.target.value)}
              placeholder={mode === "mood" ? "e.g., 'mind-bending sci-fi' or 'cozy Sunday vibes'" : "Search for a movie title..."}
              className="w-full h-14 pl-6 pr-40 rounded-xl bg-card border border-white/10 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={currentLoading || !(mode === "mood" ? inputMood.trim() : searchQuery.trim())}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /><span>{mode === "mood" ? "Discover" : "Search"}</span></>}
            </button>
          </div>

          {/* Surprise Me — mood only */}
          <AnimatePresence>
            {mode === "mood" && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 text-white/80 hover:text-white hover:border-purple-400/40 transition-all text-sm font-medium group"
                >
                  <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Surprise Me!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Quick Mood Chips — only in mood mode on home sections */}
        {mode === "mood" && showHomeSections && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
            {QUICK_MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleQuickMood(mood.value)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-primary/15 hover:border-primary/30 hover:text-white transition-all"
              >
                {mood.label}
              </button>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Trending This Week ── */}
      {showHomeSections && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">Trending This Week</h2>
          </div>
          {trendingLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="flex-shrink-0 w-56 h-36 bg-white/3 rounded-2xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div ref={scrollRef} className="flex gap-4 overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
                {trendingMovies && [...trendingMovies, ...trendingMovies, ...trendingMovies].map((movie, idx) => (
                  <motion.div
                    key={`${movie.tmdbId}-${idx}`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMovie(movie)}
                    className="flex-shrink-0 w-56 cursor-pointer group"
                  >
                    {/* Landscape card */}
                    <div className="relative h-36 rounded-2xl overflow-hidden bg-white/3 border border-white/5 group-hover:border-white/15 transition-all">
                      <img
                        src={movie.backdropPath
                          ? `https://image.tmdb.org/t/p/w500${movie.backdropPath}`
                          : `https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      {/* Rating badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-white">{Number(movie.voteAverage).toFixed(1)}</span>
                      </div>
                      {/* Info at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{movie.title}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{movie.releaseDate?.split("-")[0]}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            </div>
          )}
        </section>
      )}

      {/* ── Results Section ── */}
      <section className="space-y-6">
        {currentLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] bg-card rounded-xl border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}

        {hasQuery && !currentLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header + Filter Toggle */}
            <div className="pb-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white">
                  {mode === "search" ? `Results for "${activeSearch}"` : "Recommended for You"}
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${
                    showFilters || activeFilterCount > 0
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </button>
              </div>

              {/* AI mood genre tags */}
              {mode === "mood" && data?.genres && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.genres.map((genre, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{genre}</span>
                  ))}
                </div>
              )}

              {/* Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Genre</p>
                        <div className="flex flex-wrap gap-2">
                          {GENRES.map((genre) => (
                            <button
                              key={genre.id}
                              onClick={() => toggleGenre(genre.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                selectedGenres.includes(genre.id)
                                  ? "bg-primary text-white border-primary"
                                  : "border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                              }`}
                            >
                              {genre.name}
                            </button>
                          ))}
                          {selectedGenres.length > 0 && (
                            <button onClick={() => setSelectedGenres([])} className="px-3 py-1.5 rounded-full text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-1">
                              <X className="w-3 h-3" /> Clear
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">Year from</label>
                          <input type="number" placeholder="2000" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className="w-24 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">to</label>
                          <input type="number" placeholder="2025" value={yearTo} onChange={(e) => setYearTo(e.target.value)} className="w-24 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">Sort</label>
                          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40">
                            {SORT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-black">{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie, idx) => (
                <MovieCard key={movie.tmdbId} movie={movie} delay={idx * 0.05} onClick={() => setSelectedMovie(movie)} />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {activeFilterCount > 0 ? "No movies match your filters. Try adjusting them!" : "No movies found. Try a different search!"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
