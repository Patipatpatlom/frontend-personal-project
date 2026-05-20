import axios from "axios";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

import CartPage from "./pages/CartPage";
import VintageCakeShop from "./pages/VintageCakeShop";
import CustomCake from "./pages/CustomCake";
import PaymentSelect from "./pages/PaymentSelect";
import PaymentComplete from "./pages/PaymentComplete";
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

// Modular Effects
import FloatingFlowers from "./components/FloatingFlowers";
import SparkleCursor from "./components/SparkleCursor";

export default function App() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = location.pathname === "/login";

  // Check auth state on mount
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setRole(res.data.user.role);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    fetchMe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-pink-50">
        <span className="loading loading-spinner loading-lg text-pink-400"></span>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 overflow-hidden relative">
        {/* Modular background and interactive effects */}
        <FloatingFlowers />
        <SparkleCursor />

        {/* Global Navbar */}
        {user && !isLoginPage && <Navbar user={user} setUser={setUser} />}

        {/* Application Routes */}
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={role === "ADMIN" ? "/admin" : "/home"} replace />
              ) : (
                <Login setUser={setUser} setRole={setRole} />
              )
            }
          />

          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/shop" element={user ? <VintageCakeShop user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/custom" element={user ? <CustomCake /> : <Navigate to="/login" replace />} />
          <Route path="/payment" element={user ? <PaymentSelect /> : <Navigate to="/login" replace />} />
          <Route path="/payment-complete" element={user ? <PaymentComplete /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" replace />} />
          <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" replace />} />

          <Route
            path="/admin"
            element={user && role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/home" replace />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
