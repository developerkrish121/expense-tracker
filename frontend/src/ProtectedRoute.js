import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/expenses"); // 🔥 protected API
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem("token");
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <h2>Checking auth...</h2>;

  if (!isValid) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;