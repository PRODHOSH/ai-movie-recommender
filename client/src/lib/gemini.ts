import type { TMDBGenre } from './tmdb';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. AI recommendations will be limited.');
}

export interface MovieRecommendation {
  genres: string[];
  keywords: string[];
  reasoning: string;
}

async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

export const geminiClient = {
  async getRecommendationsForMood(
    mood: string,
    availableGenres: TMDBGenre[]
  ): Promise<MovieRecommendation> {
    if (!GEMINI_API_KEY) {
      // Fallback recommendations without AI
      return {
        genres: ['Action', 'Adventure'],
        keywords: ['popular', 'trending'],
        reasoning: 'Showing popular movies (AI recommendations unavailable)',
      };
    }

    try {
      const genreList = availableGenres.map((g) => g.name).join(', ');

      const prompt = `You are a movie recommendation expert. Based on the user's mood or situation, suggest movie genres and themes.

User's mood/situation: "${mood}"

Available genres: ${genreList}

Please provide:
1. 2-3 most suitable genres from the available list (just the genre names)
2. 2-3 keywords or themes that describe what they might enjoy
3. Brief reasoning for your recommendation (1 sentence)

Respond in JSON format:
{
  "genres": ["genre1", "genre2"],
  "keywords": ["keyword1", "keyword2"],
  "reasoning": "explanation"
}`;

      const text = await callGeminiAPI(prompt);

      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          genres: parsed.genres || ['Drama'],
          keywords: parsed.keywords || [],
          reasoning: parsed.reasoning || 'AI-powered recommendation',
        };
      }

      // Fallback if JSON parsing fails
      return {
        genres: ['Drama', 'Comedy'],
        keywords: [mood.toLowerCase()],
        reasoning: 'Based on your mood',
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
