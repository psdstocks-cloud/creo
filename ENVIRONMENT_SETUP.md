# Environment Variables Setup for Creo

This document outlines the required environment variables for the Creo application to function properly.

## Required Environment Variables

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### NEHTW API Configuration
```env
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
```

### Optional NEHTW API Settings
```env
NEXT_PUBLIC_NEHTW_TIMEOUT=30000
NEXT_PUBLIC_NEHTW_RETRIES=3
```

## Local Development Setup

1. Create a `.env.local` file in the project root
2. Add the environment variables above with your actual values
3. Restart your development server

## Vercel Deployment Setup

### Via Vercel Dashboard:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add all the required variables for Production, Preview, and Development environments

### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
vercel env add NEXT_PUBLIC_NEHTW_API_KEY
vercel env add NEXT_PUBLIC_NEHTW_BASE_URL
```

## Getting API Keys

### Supabase Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the Project URL and anon public key

### NEHTW API Setup:
1. Go to [nehtw.com](https://nehtw.com)
2. Sign up for an account
3. Get your API key from the dashboard
4. The base URL is typically `https://nehtw.com/api`

## Testing Environment Variables

You can test if your environment variables are properly configured by:

1. Starting the development server: `npm run dev`
2. Opening the browser console
3. Checking for any authentication or API errors
4. Testing the stock search and AI generation features

## Troubleshooting

- **Authentication errors**: Check that Supabase URL and key are correct
- **API errors**: Verify NEHTW API key and base URL
- **Rate limiting**: The app automatically handles 2-second rate limiting for NEHTW API
- **Build errors**: Ensure all environment variables are set in Vercel dashboard
