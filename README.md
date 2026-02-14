# AI Movie Recommender - Frontend Only

An AI-powered movie recommendation app that uses your mood to find perfect movies. Built with React, Supabase, TMDB API, and Gemini AI.

## Features

- 🎬 AI-powered movie recommendations based on your mood
- 🔐 Supabase authentication (email/password & Google OAuth)
- 🎥 TMDB API integration for movie data
- 🤖 Google Gemini AI for intelligent mood analysis
- ⭐ Save favorite movies
- 📜 View your mood history

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy your **Project URL** and **anon/public key**

#### Create Database Tables

In Supabase SQL Editor, run these commands:

```sql
-- Favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Mood History table
CREATE TABLE mood_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  genres TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view own history"
  ON mood_history FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own history
CREATE POLICY "Users can insert own history"
  ON mood_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Enable Google OAuth (Optional)

1. In Supabase Dashboard: Authentication > Providers > Google
2. Follow the instructions to set up Google OAuth
3. Add your authorized redirect URL

### 3. Get TMDB API Key

1. Create a free account at [TMDB](https://www.themoviedb.org/signup)
2. Go to Settings > API
3. Request an API key (choose "Developer" option)
4. Copy your API Key (v3 auth)

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key

### 5. Configure Environment Variables

Copy the environment template:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` and add your keys:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_TMDB_API_KEY=your-tmdb-api-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 6. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with Google
2. **Enter Your Mood**: Describe how you're feeling or what you're looking for
3. **Get Recommendations**: AI analyzes your mood and suggests movies
4. **Save Favorites**: Click the heart icon to save movies
5. **View History**: Check your past mood searches

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Movie Data**: TMDB API
- **AI**: Google Gemini AI
- **State Management**: TanStack Query (React Query)

## Project Structure

```
client/
  src/
    components/     # UI components
    hooks/          # Custom React hooks
    lib/            # API clients (Supabase, TMDB, Gemini)
    pages/          # Page components
  .env              # Environment variables (create this)
```

## API Rate Limits

- **TMDB**: 40 requests per 10 seconds (free tier)
- **Gemini**: 60 requests per minute (free tier)
- **Supabase**: Generous free tier limits

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created `client/.env` file
- Check that the values are correct (no extra spaces)

### "Failed to fetch recommendations"
- Verify your TMDB API key is valid
- Check your Gemini API key
- Open browser console for detailed errors

### Authentication not working
- Verify Supabase URL and anon key
- Check that you created the database tables
- Ensure RLS policies are enabled

### Movies not saving to favorites
- Make sure you're logged in
- Check that database tables exist
- Verify RLS policies are set up correctly

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
