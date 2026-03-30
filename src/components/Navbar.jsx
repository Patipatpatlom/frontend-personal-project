import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
console.log(cart)
  return (
    <div className="navbar bg-white/60 backdrop-blur-md shadow-lg px-6 sticky top-0 z-50 border-b border-pink-100">

      {/* LOGO */}
      <div className="flex-1">
        <Link to="/home" className="text-2xl font-bold text-pink-500">
          🍰 Real or Cake
        </Link>
      </div>

      {/* MENU */}
      <div className="flex items-center gap-6 text-sm">

        <Link
          to="/home"
          className={isActive("/home") ? "text-pink-500 font-bold" : ""}
        >
          Home
        </Link>

        <Link
          to="/shop"
          className={isActive("/shop") ? "text-pink-500 font-bold" : ""}
        >
          Shop
        </Link>

        <Link
          to="/custom"
          className={isActive("/custom") ? "text-pink-500 font-bold" : ""}
        >
          Custom
        </Link>

        {/* 💀 MY ORDERS */}
        <Link
          to="/my-orders"
          className={isActive("/my-orders") ? "text-pink-500 font-bold" : ""}
        >
          My Orders
        </Link>

        {/* 🛒 CART */}
        <Link to="/cart">
          <motion.div className="relative">
            🛒
            {cart.length > 0 && (
              <span className="badge badge-sm bg-pink-500 text-white absolute -top-2 -right-3">
                {cart.length}
              </span>
            )}
          </motion.div>
        </Link>

        {/* 👤 USER */}
        <span className="text-gray-500">
          👋 {user?.email}
        </span>

        {/* 🔥 ADMIN DROPDOWN */}
        {user?.role === "ADMIN" && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm bg-black text-white">
              Admin ⚙️
            </label>

            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
              <li>
                <button onClick={() => navigate("/admin")}>
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/my-orders")}>
                  Orders
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline btn-error"
        >
          Logout
        </button>

      </div>
    </div>
  );
}