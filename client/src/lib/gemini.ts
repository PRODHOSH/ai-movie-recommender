import type { TMDBGenre } from './tmdb';

export interface MovieRecommendation {
  genres: string[];
  keywords: string[];
  reasoning: string;
}

// Call our secure serverless function instead of directly calling Gemini API
async function callGeminiAPI(mood: string): Promise<string[]> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mood }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.genres || [];
}

export const geminiClient = {
  async getRecommendationsForMood(
    mood: string,
    availableGenres: TMDBGenre[]
  ): Promise<MovieRecommendation> {
    try {
      // Call our secure serverless API
      const genres = await callGeminiAPI(mood);

      return {
        genres: genres.slice(0, 3),
        keywords: [mood.toLowerCase(), 'recommended'],
        reasoning: 'AI-powered recommendations based on your mood',
      };
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Fallback recommendations based on simple mood analysis
      const moodLower = mood.toLowerCase();
      if (moodLower.includes('happy') || moodLower.includes('fun')) {
        return {
          genres: ['Comedy', 'Adventure'],
          keywords: ['feel-good', 'uplifting'],
          reasoning: 'Light-hearted movies to match your positive mood',
        };
      } else if (moodLower.includes('sad') || moodLower.includes('emotional')) {
        return {
          genres: ['Drama', 'Romance'],
          keywords: ['emotional', 'touching'],
          reasoning: 'Emotional stories for introspection',
        };
      } else if (moodLower.includes('exciting') || moodLower.includes('action')) {
        return {
          genres: ['Action', 'Thriller'],
          keywords: ['intense', 'thrilling'],
          reasoning: 'High-energy movies to match your excitement',
        };
      } else if (moodLower.includes('scary') || moodLower.includes('horror')) {
        return {
          genres: ['Horror', 'Thriller'],
          keywords: ['suspenseful', 'scary'],
          reasoning: 'Spine-chilling entertainment',
        };
      } else if (moodLower.includes('think') || moodLower.includes('mind')) {
        return {
          genres: ['Science Fiction', 'Mystery'],
          keywords: ['thought-provoking', 'complex'],
          reasoning: 'Movies that challenge your mind',
        };
      }

      return {
        genres: ['Drama', 'Adventure'],
        keywords: ['engaging', 'popular'],
        reasoning: 'Popular movies based on your input',
      };
    }
  },
};
