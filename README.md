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

**📋 Complete Setup Guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Quick steps:
1. Create account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your Project URL and anon key from Settings > API
4. Run the SQL commands to create tables (see full guide)
5. Enable Google OAuth (optional but recommended)
6. Add keys to `client/.env`

**For detailed step-by-step instructions with screenshots and troubleshooting, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

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
