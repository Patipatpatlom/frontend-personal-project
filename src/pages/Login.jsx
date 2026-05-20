import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../context/useDateTime";
import { Mail, Lock, User, Sparkles, LogIn } from "lucide-react";

export default function Login({ setUser, setRole }) {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async () => {
    if (!form.email || !form.password) {
      alert("กรุณากรอก Email และ Password 🎂");
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
      for (let i = 0; i < 25; i++) {
        const heart = document.createElement("div");
        heart.innerText = i % 2 === 0 ? "💖" : "🍰";
        heart.style.position = "fixed";
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.fontSize = "28px";
        heart.style.zIndex = "9999";
        heart.style.pointerEvents = "none";
        document.body.appendChild(heart);

        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;

        heart.animate(
          [
            { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(2)`, opacity: 0 },
          ],
          { duration: 1000, ease: "ease-out" }
        );

        setTimeout(() => heart.remove(), 1000);
      }

      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert("Login ไม่สำเร็จ 💀 รหัสผ่านหรืออีเมลอาจจะไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน 🍰");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("สมัครสมาชิกสำเร็จ 🎉");
      setIsLogin(true);
    } catch (err) {
      alert("สมัครไม่สำเร็จ 💀 อาจมีผู้ใช้งานอีเมลนี้แล้ว");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[url('/src/assets/cake.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center relative overflow-hidden">
      
      {/* Subtle overlay to ensure high contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20 pointer-events-none" />

      {/* FORM CARD */}
      <div className="w-full max-w-[400px] z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-8 shadow-[0_30px_60px_rgba(231,114,142,0.25)] border border-white/50 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-pink-100/80 rounded-full mb-3 shadow-inner"
            >
              <Sparkles className="w-6 h-6 text-pink-500" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">
              {isLogin ? "Real or Cake? 🎂" : "Join Cake World! 🍰"}
            </h2>
            <p className="text-sm font-bold text-pink-600/80 mt-1 uppercase tracking-widest">
              {isLogin ? "Satisfy your cravings" : "Create a sweet account"}
            </p>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username-input"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative flex items-center"
                >
                  <User className="absolute left-4 text-pink-400 w-5 h-5" />
                  <input
                    name="username"
                    placeholder="Your Full Name"
                    value={form.username}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-12 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-pink-300 border-gray-200 outline-none font-bold text-gray-700 placeholder-gray-400 transition"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-pink-400 w-5 h-5" />
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full pl-12 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-pink-300 border-gray-200 outline-none font-bold text-gray-700 placeholder-gray-400 transition"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-pink-400 w-5 h-5" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full pl-12 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-pink-300 border-gray-200 outline-none font-bold text-gray-700 placeholder-gray-400 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isLogin ? handleLoginSubmit : handleRegisterSubmit}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 border-none transition-all duration-300"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Sweet loading..." : isLogin ? "Log In 💖" : "Sign Up ✨"}
          </motion.button>

          {/* Toggle link */}
          <div className="text-center mt-2">
            <span
              className="text-sm font-bold text-pink-700 hover:text-pink-900 cursor-pointer transition underline decoration-2 decoration-pink-300"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create an account 🍰" : "Already have an account? Log In 🔑"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}