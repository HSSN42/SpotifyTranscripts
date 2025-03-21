import overview from "../images/overview.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  // Debug logging for environment variables
  console.log('Environment Variables in Home:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_SPOTIFY_CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    REACT_APP_FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL
  });

  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = encodeURIComponent(`${process.env.REACT_APP_FRONTEND_URL}/discover`);
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state";
  
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current URL:", window.location.href);
    console.log("Current hash:", window.location.hash);
    
    if (token) {
      console.log("Already authenticated, redirecting to discover...");
      navigate("/discover");
    }
  }, [token, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("Starting Spotify auth...");
    console.log("Client ID:", CLIENT_ID);
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Frontend URL:", process.env.REACT_APP_FRONTEND_URL);
    
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&show_dialog=true`;
    
    console.log("Redirect URI:", decodeURIComponent(REDIRECT_URI));
    console.log("Full auth URL:", authUrl);
    
    window.location.href = authUrl;
  };

  return (
    <div className="text-white bg-spotifyDarkGray h-screen">
      <div className="mx-auto grid grid-cols-5 gap-20 lg:w-10/12 w-12/12 pt-60 ">
        <div className="col-span-2 pt-16 ">
          <h1 className="text-5xl font-bold">Spotify Transcripts</h1>
          <p className="text-lg mt-4 mb-12">
            A proof of concept for an improved podcast experience powered by AI.
          </p>

          <button
            onClick={handleLogin}
            className="bg-spotifyLightGreen hover:bg-spotifyDarkGreen text-spotifyDarkGray px-6 py-4 rounded-full cursor-pointer text-center text-sm font-semibold uppercase tracking-wider"
          >
            Log in with Spotify
          </button>
        </div>

        <div className="col-span-3">
          <img
            src={overview}
            className="rounded-lg shadow border-2 border-black"
            alt="Overview"
          />
        </div>
      </div>
    </div>
  );
}
