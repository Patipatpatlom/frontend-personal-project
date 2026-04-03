// 🎂 ULTRA PREMIUM CAKE UI (FULL EFFECT MODE)
// เพิ่ม: 🌸 กลีบดอกไม้ปลิว + ✨ sparkle cursor + 💖 login explosion

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

import CartPage from "./pages/CartPage";
import VintageCakeShop from "./pages/VintageCakeShop";
import CustomCake from "./pages/CustomCake";
import PaymentSelect from "./pages/PaymentSelect";
import PaymentComplete from "./pages/PaymentComplete";
import Home from "./pages/Home";
import CakeShop from "./pages/CakeShop";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import { useUserStore } from "./context/useDateTime";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const isLoginPage = location.pathname === "/login";

  // 🌈 PARALLAX
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 15 });

  const handleMouseMove = (e) => {
    mouseX.set((e.clientX - window.innerWidth / 2) / 30);
    mouseY.set((e.clientY - window.innerHeight / 2) / 30);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = useUserStore((state) => state.login);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("กรุณากรอก Email และ Password");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login({ user: res.data.user, token: res.data.token });
      setUser(res.data.user);
      setRole(res.data.user.role);

      // 💖 HEART EXPLOSION EFFECT
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.innerText = "💖";
        heart.style.position = "fixed";
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.fontSize = "24px";
        heart.style.zIndex = "9999";
        document.body.appendChild(heart);

        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;

        heart.animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: `translate(${x}px, ${y}px)`, opacity: 0 },
          ],
          { duration: 800 }
        );

        setTimeout(() => heart.remove(), 800);
      }

      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert("Login ไม่สำเร็จ 💀");
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err) {
      alert("สมัครไม่สำเร็จ 💀");
    } finally {
      setLoading(false);
    }
  };

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

  // 🌸 FLOATING FLOWERS
  const Flowers = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * window.innerWidth }}
          animate={{ y: "110vh", rotate: 360 }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          className="absolute text-pink-300 text-xl"
        >
          🌸
        </motion.div>
      ))}
    </div>
  );

  // ✨ SPARKLE CURSOR
  useEffect(() => {
    const sparkle = (e) => {
      const star = document.createElement("div");
      star.innerText = "✨";
      star.style.position = "fixed";
      star.style.left = e.clientX + "px";
      star.style.top = e.clientY + "px";
      star.style.pointerEvents = "none";
      star.style.fontSize = "14px";
      document.body.appendChild(star);

      star.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(2)", opacity: 0 },
        ],
        { duration: 600 }
      );

      setTimeout(() => star.remove(), 600);
    };

    window.addEventListener("mousemove", sparkle);
    return () => window.removeEventListener("mousemove", sparkle);
  }, []);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-pink-400"></span>
      </div>
    );
  }

  return (
    <CartProvider>
      <div
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 overflow-hidden"
      >
        <Flowers />

        {user && !isLoginPage && <Navbar user={user} setUser={setUser} />}


        
        <Routes>
          <Route
            path="/login"
            element={
              <div className="flex h-screen w-full bg-[url('/src/assets/cake.png')] bg-accent-content" >
                <div className="hidden  lg:flex w-3/5 items-center justify-center">
               
                  
                  <motion.img
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Fvdml5Ym85cmU5NG5kNWZ1b2cxYWhhaWQxNDIzbjQ1cTcxaHZkNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TbyAOtYa4ywrSpvjtm/giphy.gif"
                    style={{ x: springX, y: springY }}
                    className="w-125 h-125 drop-shadow-2xl border-orange-300 border-4 rounded-full"
                    
                  />
     

                </div>
                

                <div className="w-full lg:w-2/5 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card w-[360px] bg-white/70 backdrop-blur-xl shadow-2xl"
                  >
                    <div className="card-body">
                      <h2 className="text-3xl font-bold text-center text-pink-500">
                        {isLogin ? "Real or Cake 🎂" : "Join Cake World 🍰"}
                      </h2>

                      {!isLogin && (
                        <input
                          name="username"
                          placeholder="Your Name"
                          onChange={handleChange}
                          className="input input-bordered"
                        />
                      )}

                      <input name="email" placeholder="Email" onChange={handleChange} className="input input-bordered" />
                      
                      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input input-bordered" />

                      <button
                        onClick={isLogin ? handleLogin : handleRegister}
                        className="btn bg-gradient-to-r from-pink-400 to-rose-400 text-white border-none hover:scale-105"
                      >
                        {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                      </button>

                      <p
                        className="text-center text-sm cursor-pointer"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? "Create account 💖" : "Back to login ✨"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            }
            
          />

          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/shop" element={user ? <VintageCakeShop user={user} /> : <Navigate to="/login" />} />
          <Route path="/custom" element={user ? <CustomCake /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PaymentSelect /> : <Navigate to="/login" />} />
          <Route path="/payment-complete" element={user ? <PaymentComplete /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />

          <Route
            path="/admin"
            element={user && role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/home" />}
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
