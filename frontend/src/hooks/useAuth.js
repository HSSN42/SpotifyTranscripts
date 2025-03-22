import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuth() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuth = () => {
      const hash = window.location.hash;
      let storedToken = window.localStorage.getItem("token");

      console.log("Auth state:", {
        path: location.pathname,
        hash: hash,
        storedToken: storedToken ? "exists" : "none"
      });

      // If we have a hash, this means we just got redirected from Spotify
      if (hash) {
        try {
          // Extract token from hash
          const params = new URLSearchParams(hash.substring(1));
          const tokenMatch = params.get("access_token");

          if (tokenMatch) {
            console.log("Found new token from Spotify redirect");
            window.localStorage.setItem("token", tokenMatch);
            setToken(tokenMatch);
            
            // Clear the hash but keep the pathname
            const currentPath = window.location.pathname || "/discover";
            window.history.replaceState({}, document.title, currentPath);
            
            // Only navigate if we're not already on the target path
            if (currentPath !== "/discover") {
              navigate("/discover", { replace: true });
            }
            return;
          } else {
            console.log("No token found in hash:", hash);
          }
        } catch (error) {
          console.error("Error processing hash:", error);
        }
      }

      // If we have a stored token, use it
      if (storedToken) {
        console.log("Using stored token");
        setToken(storedToken);
        
        // Only redirect to discover if we're on the home page
        if (location.pathname === "/") {
          navigate("/discover", { replace: true });
        }
      } else {
        console.log("No token available");
        setToken("");
      }
    };

    processAuth();
  }, [navigate, location.pathname]);

  // Provide a function to clear the token
  const logout = () => {
    window.localStorage.removeItem("token");
    setToken("");
    navigate("/", { replace: true });
  };

  return token;
}
