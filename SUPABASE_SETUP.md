# Supabase Authentication Setup Guide

Complete step-by-step guide to set up Supabase authentication for the AI Movie Recommender app.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with your GitHub account (recommended) or email

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `ai-movie-recommender` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Select **Free** (plenty for this app)
3. Click **"Create new project"**
4. Wait 1-2 minutes for the project to be set up

## Step 3: Get Your API Keys

1. In your project dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **anon/public key:** (long string starting with `eyJ...`)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copy both values and add them to your `client/.env` file:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Configure Authentication Settings

1. In the Supabase dashboard, go to **"Authentication"** → **"Configuration"**
2. Scroll to **"Site URL"**
   - For development: `http://localhost:5173`
   - For production: Add your deployed URL later
3. Scroll to **"Redirect URLs"**
   - Add: `http://localhost:5173/**` (allows all local routes)
   - Add your production URL later: `https://yourdomain.com/**`
4. Click **"Save"**

## Step 5: Enable Email Authentication

1. Go to **"Authentication"** → **"Providers"**
2. **Email** should be enabled by default
3. Configure email settings:
   - Enable **"Confirm email"** (recommended for security)
   - Enable **"Secure email change"** (recommended)
4. Click **"Save"**

### Email Confirmation

By default, Supabase sends a confirmation email. For development testing:
- Option A: Check your email and click the confirmation link
- Option B: Disable email confirmation temporarily:
  1. Go to **"Authentication"** → **"Email Templates"**
  2. In the **"Confirm signup"** template, you can customize or disable it

## Step 6: Enable Google OAuth (Recommended)

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**:
   - Go to **"APIs & Services"** → **"Library"**
   - Search for "Google+ API"
   - Click and enable it

4. Create OAuth 2.0 Credentials:
   - Go to **"APIs & Services"** → **"Credentials"**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Application type: **Web application**
   - Name: `AI Movie Recommender`
   
5. Add Authorized redirect URIs:
   - Get the callback URL from Supabase (see below)
   - Format: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Click **"Create"**

6. Copy the **Client ID** and **Client Secret**

### Configure Google in Supabase

1. In Supabase dashboard: **"Authentication"** → **"Providers"**
2. Find **"Google"** and click to expand
3. Enable Google provider
4. Paste your **Client ID** and **Client Secret**
5. Copy the **"Callback URL (for OAuth)"** shown (format: `https://[your-ref].supabase.co/auth/v1/callback`)
6. Go back to Google Cloud Console and add this URL to **"Authorized redirect URIs"** (if not done already)
7. Click **"Save"** in Supabase

### Update Google Cloud Console Redirect URIs

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, add:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Replace `xxxxxxxxxxxxx` with your actual Supabase project reference)
5. Click **"Save"**

## Step 7: Create Database Tables

Your app needs two tables to store user data.

1. In Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and manage their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create mood_history table
CREATE TABLE mood_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  genres TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_mood_history_user_id ON mood_history(user_id);
CREATE INDEX idx_mood_history_created_at ON mood_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and manage their own history
CREATE POLICY "Users can view own history"
  ON mood_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON mood_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

4. Click **"Run"** or press `Ctrl+Enter`
5. You should see **"Success. No rows returned"**

## Step 8: Verify Everything Works

1. Check that tables are created:
   - Go to **"Table Editor"** in Supabase
   - You should see `favorites` and `mood_history` tables

2. Check RLS policies:
   - Click on a table
   - Click the **shield icon** (RLS)
   - You should see the policies listed

## Step 9: Test Authentication

1. Make sure your `client/.env` file has all the values:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_TMDB_API_KEY=your-tmdb-api-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173`

4. Click **"Sign Up"** and test:
   - **Email/Password**: Create an account with your email
   - **Google Sign-In**: Click "Continue with Google"

5. Check Supabase dashboard:
   - Go to **"Authentication"** → **"Users"**
   - You should see your newly created user!

## Common Issues & Solutions

### Issue: "Invalid redirect URL"
**Solution**: 
- Make sure you added `http://localhost:5173/**` to Redirect URLs in Supabase
- Check that Site URL is set to `http://localhost:5173`

### Issue: Google sign-in not working
**Solution**:
- Verify the callback URL in Google Cloud Console matches Supabase
- Make sure Google+ API is enabled
- Check that Client ID and Secret are correct in Supabase
- Wait a few minutes after updating settings (sometimes takes time to propagate)

### Issue: "Email not confirmed"
**Solution**:
- Check your email inbox (and spam folder)
- Or temporarily disable email confirmation in Auth settings

### Issue: Can't save favorites
**Solution**:
- Make sure you ran the SQL to create tables
- Verify RLS policies are enabled
- Check browser console for errors

### Issue: "Missing environment variables"
**Solution**:
- Make sure `client/.env` exists (not just `.env.example`)
- Restart your dev server after adding env variables
- Check that variables start with `VITE_` prefix

## Security Notes

✅ **Row Level Security (RLS)** is enabled - users can only access their own data
✅ **anon/public key** is safe to use in frontend code
❌ **Never expose** your service_role key or database password
✅ Always use HTTPS in production

## Next Steps

Once authentication is working:
1. Get your TMDB API key → [Setup Guide](https://www.themoviedb.org/settings/api)
2. Get your Gemini API key → [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Add them to your `client/.env` file
4. Start discovering movies! 🎬

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add your production URL to Supabase:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

2. Update Google Cloud Console:
   - Add production callback URL: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`

3. Add environment variables to your hosting platform:
   - Copy all variables from `client/.env`
   - Add them to your hosting environment settings

## Support

If you encounter issues:
- Check [Supabase Docs](https://supabase.com/docs)
- Visit [Supabase Discord](https://discord.supabase.com)
- Check the browser console for error messages
