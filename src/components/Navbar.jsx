import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const { cart } = useCart(); // ✅ ใช้ตัวนี้

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="navbar bg-white shadow-md px-6 sticky top-0 z-50">

      <div className="flex-1">
        <Link to="/home" className="text-2xl font-bold text-pink-500">
          🍰 Real or Cake
        </Link>
      </div>

      <div className="flex items-center gap-6">

        <Link to="/shop">Shop</Link>
        <Link to="/custom">Custom</Link>

        {/* 🛒 CART */}
        <Link to="/cart">
          <motion.div className="relative">
            🛒
            {cart.length > 0 && (
              <span className="badge badge-sm badge-error absolute -top-2 -right-3">
                {cart.length}
              </span>
            )}
          </motion.div>
        </Link>

        <span className="text-sm text-gray-500">
          👋 {user?.email}
        </span>

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