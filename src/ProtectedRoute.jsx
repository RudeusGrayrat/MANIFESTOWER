import { Navigate, useLocation } from "react-router";
import LoadingOverlay from "./components/ui/cards/LoadingOverlay";
import { useAuth } from "./components/context/AuthContext";
import { useEffect, useState } from "react";

// 1. Recibe 'children' como parámetro
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showLoading) return <LoadingOverlay message="Cargando..." />;

  if (!isAuthenticated) {
    localStorage.setItem("lastRoute", location.pathname);
    return <Navigate to="/login" replace />; // Tu redirección corregida al /login
  }

  // 2. RETORNA LOS CHILDREN en lugar del <Outlet />
  return children;
};

export default ProtectedRoute;