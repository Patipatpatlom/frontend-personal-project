import axios from "axios";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

import CartProvider from "./context/CartContext";
import Navbar from "./components/Navbar";

import CartPage from "./pages/CartPage";
import VintageCakeShop from "./pages/VintageCakeShop";
import CustomCake from "./pages/CustomCake";
import PaymentSelect from "./pages/PaymentSelect";
import PaymentComplete from "./pages/PaymentComplete";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // ✅ FIX: role state
  const [role, setRole] = useState(null);

  // 🪄 PARALLAX
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    mouseX.set((e.clientX - window.innerWidth / 2) / 25);
    mouseY.set((e.clientY - window.innerHeight / 2) / 25);
  };

  const [form, setForm] = useState({ email: "", username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 LOGIN
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("กรุณากรอก Email และ Password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // ✅ SAVE USER + TOKEN
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
      setRole(res.data.user.role);

      navigate("/home");
    } catch {
      alert("Login ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ✨ REGISTER
  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("สมัครสำเร็จ 🎉");
      setIsLogin(true);
    } catch {
      alert("สมัครไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIX: get real user role from backend
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
        setRole(res.data.user.role);
      } catch (err) {
        console.log("auth/me error:", err.response?.data);
      }
    };

    fetchMe();
  }, []);

  return (
    <CartProvider>
      <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#FFF5F7]">

        {/* Navbar */}
        {user && <Navbar user={user} setUser={setUser} />}

        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={
            <div className="flex h-screen">
              <div className="hidden lg:flex w-3/5 items-center justify-center">
                <motion.div style={{ x: springX, y: springY }}>
                  <img
                    src="https://dbakers.us/cdn/shop/files/vintage-ruffles-cakedbakers-miami-2817614.png"
                    className="w-full max-w-[600px]"
                  />
                </motion.div>
              </div>

              <div className="w-full lg:w-2/5 flex items-center justify-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl w-[350px]">

                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {isLogin ? "Login" : "Register"}
                  </h2>

                  {!isLogin && (
                    <input
                      name="username"
                      placeholder="Name"
                      onChange={handleChange}
                      className="w-full mb-2 p-2 border rounded"
                    />
                  )}

                  <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                  />

                  <button
                    onClick={isLogin ? handleLogin : handleRegister}
                    className="w-full bg-pink-500 text-white py-2 rounded mt-2"
                  >
                    {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                  </button>

                  <p
                    className="text-center mt-3 cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create account" : "Back to login"}
                  </p>

                </div>
              </div>
            </div>
          } />

          {/* PROTECTED */}
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/shop" element={user ? <VintageCakeShop /> : <Navigate to="/login" />} />
          <Route path="/custom" element={user ? <CustomCake /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PaymentSelect /> : <Navigate to="/login" />} />
          <Route path="/payment-complete" element={user ? <PaymentComplete /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />

          {/* 🔥 ADMIN FIXED */}
          <Route
            path="/admin"
            element={
              role === "admin"
                ? <AdminDashboard />
                : <Navigate to="/home" />
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </div>
    </CartProvider>
  );
}