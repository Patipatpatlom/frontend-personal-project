import axios from "axios";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import SelectDateTime from "./pages/SelectDateTime";

export default function App() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // ❌ ลบ name ออกแล้ว
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ handleChange
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = async () => {
    // ✅ เช็คค่าว่าง
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      alert("กรอกข้อมูลให้ครบ ❗");
      return;
    }

    // ✅ เช็ค password
    if (form.password !== form.confirmPassword) {
      alert("Password ไม่ตรงกัน ❌");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("สมัครสำเร็จ 🎉");
      setIsLogin(true);

    } catch (err) {
      alert(err.response?.data?.message || "Register fail ❌");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/select-datetime");

    } catch (err) {
      alert("Login ไม่ถูก ❌");
    }
  };

  return (
    <Routes>

      {/* ================= LOGIN PAGE ================= */}
      <Route
        path="/"
        element={
          <div className="flex h-screen">

            {/* LEFT */}
            <div className="w-1/2 flex items-center justify-center bg-base-200">

              {isLogin ? (
                // 🔐 LOGIN
                <div className="w-[400px] p-8 rounded-2xl border border-red-300 bg-white shadow-lg flex flex-col items-center">

                  <h1 className="text-3xl font-bold text-red-700 mb-6">
                    Login
                  </h1>

                  <input
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-4 rounded-full"
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-6 rounded-full"
                  />

                  <button
                    onClick={handleLogin}
                    className="btn bg-red-700 text-white rounded-full w-full"
                  >
                    LOGIN
                  </button>

                  <p className="mt-4 text-sm">
                    Don't have account?{" "}
                    <span
                      className="text-red-700 cursor-pointer"
                      onClick={() => setIsLogin(false)}
                    >
                      Sign Up
                    </span>
                  </p>
                </div>
              ) : (
                // 📝 REGISTER
                <div className="w-[380px] p-8 rounded-2xl border border-red-300 bg-white shadow-lg">

                  <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
                    Register
                  </h1>

                  <input
                    name="username"
                    placeholder="username"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-4 rounded-full"
                  />

                  <input
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-4 rounded-full"
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-4 rounded-full"
                  />

                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    onChange={handleChange}
                    className="input border-red-700 w-full mb-6 rounded-full"
                  />

                  <button
                    onClick={handleRegister}
                    className="btn bg-red-700 text-white rounded-full w-full"
                  >
                    REGISTER
                  </button>

                  <p className="mt-4 text-sm text-center">
                    Already have account?{" "}
                    <span
                      className="text-red-700 cursor-pointer"
                      onClick={() => setIsLogin(true)}
                    >
                      Sign In
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-1/2">
              <img
                src="https://dbakers.us/cdn/shop/files/vintage-ruffles-cakedbakers-miami-2817614.png?v=1761178093"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        }
      />

      {/* 🎂 SELECT DATE PAGE */}
      <Route path="/select-datetime" element={<SelectDateTime />} />

    </Routes>
  );
}