import "./styles/tailwind.css";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Episode from "./pages/Episode";
import { useAuth } from "./hooks/useAuth";
import Discover from "./pages/Discover";

function ProtectedRoute({ children }) {
  const token = useAuth();
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        }
      />
      <Route
        path="/episode"
        element={
          <ProtectedRoute>
            <Episode />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
