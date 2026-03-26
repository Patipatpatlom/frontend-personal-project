import axios from "axios";
import { useState } from "react";

axios


export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.placeholder.toLowerCase().replace(" ", "")]: e.target.value });
  };

  // REGISTER
 const handleRegister = async () => {
  try {
    await axios.post("http://localhost:5000/register", {
      name: form.name,
      email: form.email,
      username: form.username,
      password: form.password,
    });

    alert("สมัครสำเร็จ 🎉");
    setIsLogin(true);
  } catch (err) {
    console.log(err);
    alert("Register fail ❌");
  }
};

  // LOGIN
const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/login", {
      username: form.username,
      password: form.password,
    });

    alert("Login สำเร็จ 🎉");

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setIsLoggedIn(true);

  } catch (err) {
    console.log(err);
    alert("Login ไม่ถูก ❌");
  }
};

  // 🟢 HOME PAGE
  if (isLoggedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-200">
        <h1 className="text-4xl font-bold text-red-700 mb-4">🎉 Welcome to Home</h1>
        <button
          className="btn bg-red-700 text-white"
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">

      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center bg-base-200">

        {/* LOGIN */}
        {isLogin ? (
          <div className="w-[400px] h-[400px] rounded-full border-4 border-red-700 flex flex-col items-center justify-center bg-white/70 backdrop-blur shadow-[0_10px_30px_rgba(185,28,28,0.4)]">

            <h1 className="text-3xl font-bold text-red-700 mb-6">Login</h1>

            <input
              placeholder="username"
              onChange={handleChange}
              className="input border-red-700 w-3/4 mb-4 rounded-full"
            />

            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              className="input border-red-700 w-3/4 mb-6 rounded-full"
            />

            <button
              onClick={handleLogin}
              className="btn bg-red-700 text-white rounded-full w-40"
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

          /* REGISTER */
          <div className="w-[380px] p-8 rounded-2xl border border-red-300 bg-white shadow-[0_10px_30px_rgba(185,28,28,0.4)]">

            <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
              Register
            </h1>

            <input placeholder="username" onChange={handleChange} className="input border-red-700 w-full mb-4 rounded-full" />
            <input placeholder="email" onChange={handleChange} className="input border-red-700 w-full mb-4 rounded-full" />
            <input type="password" placeholder="password" onChange={handleChange} className="input border-red-700 w-full mb-4 rounded-full" />
            <input type="password" placeholder="confirmpassword" onChange={handleChange} className="input border-red-700 w-full mb-6 rounded-full" />

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
      <div className="w-1/2 relative">
        <img
          src="https://dbakers.us/cdn/shop/files/vintage-ruffles-cakedbakers-miami-2817614.png?v=1761178093"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-160 left-10 text-5xl font-bold">
          <span className="text-orange-400 drop-shadow-lg">Real or</span>
          <br />
          <span className="text-pink-400 drop-shadow-lg">Cake?</span>
        </div>

    </div>
  );
}