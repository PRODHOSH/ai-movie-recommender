import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the Gemini API key from environment (server-side only, no VITE_ prefix)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== 'string') {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on the mood "${mood}", suggest 3 movie genres that would match this mood. Return ONLY the genre names separated by commas, nothing else. Choose from: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, TV Movie, Thriller, War, Western.`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Parse genres from response
    const genres = text
      .split(',')
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0)
      .slice(0, 3);

    return res.status(200).json({ genres });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Return fallback genres based on mood keywords
    const fallbackGenres = getFallbackGenres(req.body.mood);
    return res.status(200).json({ 
      genres: fallbackGenres,
      fallback: true 
    });
  }
}

// Fallback function for when API fails
function getFallbackGenres(mood: string): string[] {
  const moodLower = mood.toLowerCase();
  
  if (moodLower.includes('happy') || moodLower.includes('joy')) {
    return ['Comedy', 'Animation', 'Family'];
  } else if (moodLower.includes('sad') || moodLower.includes('emotional')) {
    return ['Drama', 'Romance', 'Music'];
  } else if (moodLower.includes('excited') || moodLower.includes('energetic')) {
    return ['Action', 'Adventure', 'Thriller'];
  } else if (moodLower.includes('scared') || moodLower.includes('spooky')) {
    return ['Horror', 'Thriller', 'Mystery'];
  } else if (moodLower.includes('romantic') || moodLower.includes('love')) {
    return ['Romance', 'Drama', 'Comedy'];
  } else if (moodLower.includes('curious') || moodLower.includes('thoughtful')) {
    return ['Documentary', 'Science Fiction', 'Mystery'];
  } else {
    return ['Drama', 'Comedy', 'Action'];
  }
}
