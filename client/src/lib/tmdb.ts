const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  budget: number;
  revenue: number;
  genres: TMDBGenre[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const tmdbClient = {
  async searchMovies(query: string): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    const data = await response.json();
    return data.results || [];
  },

  async getMoviesByGenre(genreIds: number[], page = 1): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get movies by genre');
    }
    
    const data = await response.json();
    return data.results || [];
  },

  async getPopularMovies(page = 1): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get popular movies');
    }
    
    const data = await response.json();
    return data.results || [];
  },

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get trending movies');
    }
    
    const data = await response.json();
    return data.results || [];
  },

  async getGenres(): Promise<TMDBGenre[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get genres');
    }
    
    const data = await response.json();
    return data.genres || [];
  },

  async getNowPlayingMovies(): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    if (!response.ok) throw new Error('Failed to get now playing movies');
    const data = await response.json();
    return data.results || [];
  },

  async getTopRatedMovies(): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    if (!response.ok) throw new Error('Failed to get top rated movies');
    const data = await response.json();
    return data.results || [];
  },

  async getSimilarMovies(id: number): Promise<TMDBMovie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    if (!response.ok) throw new Error('Failed to get similar movies');
    const data = await response.json();
    return data.results || [];
  },

  async getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!response.ok) throw new Error('Failed to get movie details');
    return response.json();
  },

  async getMovieCredits(id: number): Promise<{ cast: TMDBCastMember[]; crew: TMDBCrewMember[] }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to get movie credits');
    return response.json();
  },

  async getMovieVideos(id: number): Promise<TMDBVideo[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to get movie videos');
    const data = await response.json();
    return data.results || [];
  },

  getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
