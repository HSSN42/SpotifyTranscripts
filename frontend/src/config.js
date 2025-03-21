const isDevelopment = process.env.NODE_ENV === 'development';

// Base URLs
const DEV_FRONTEND_URL = 'http://localhost:3000';
const DEV_BACKEND_URL = 'http://localhost:5000';
const PROD_FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
const PROD_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

if (!isDevelopment && (!PROD_FRONTEND_URL || !PROD_BACKEND_URL)) {
  console.error('Missing required environment variables:', {
    REACT_APP_FRONTEND_URL: PROD_FRONTEND_URL,
    REACT_APP_BACKEND_URL: PROD_BACKEND_URL
  });
}

export const config = {
  frontendUrl: isDevelopment ? DEV_FRONTEND_URL : PROD_FRONTEND_URL,
  backendUrl: isDevelopment ? DEV_BACKEND_URL : PROD_BACKEND_URL,
  spotifyClientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID
}; 