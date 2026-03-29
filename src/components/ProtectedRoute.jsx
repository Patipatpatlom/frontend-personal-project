import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setIsAuth(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // check role admin
        if (res.data.user.role !== "ADMIN") {
          setIsAuth(false);
        } else {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="p-10 font-bold text-xl">
        Checking access 💀...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}