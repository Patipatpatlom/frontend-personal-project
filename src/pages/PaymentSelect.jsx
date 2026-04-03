import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // 🌟 เพิ่ม import Framer Motion

export default function PaymentSelect() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  // ==========================================
  // ⛔ โลจิกเดิมทั้งหมด ไม่มีการเปลี่ยนแปลง
  // ==========================================
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token"); // 💀 สำคัญมาก

      const body = {
        items: cart.map((item) => ({
          cakeId: Number(item.cake_id),
          quantity: item.quantity || 1,
          price: item.price,
        })),
      };

    

     

      navigate("/my-orders")
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Payment failed 💀");
    }
  };

  // ==========================================
  // ✨ อัปเกรด UI ใหม่ด้วย DaisyUI + Tailwind + Framer Motion
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card w-full max-w-lg bg-base-100 shadow-2xl border-t-8 border-pink-400"
      >
        <div className="card-body">
          {/* 🟢 Header: Success Order Preview */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-pink-500 rounded-full mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-800">Success Order✨</h1>
            <p className="text-gray-500 text-sm mt-1"></p>
          </div>

          {/* 📋 รายการสินค้า (Cart Items) */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner max-h-64 overflow-y-auto custom-scrollbar space-y-3">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-4 font-medium">Cart is empty 💀</p>
            ) : (
              cart.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }} // ไล่สเต็ปแอนิเมชันทีละแถว
                  key={i} 
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {/* ไอคอนเค้กน่ารักๆ แทนรูป */}
                    <div className="w-10 h-10 bg-pink-100 rounded-md flex items-center justify-center text-xl shadow-sm">
                      🍰
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm md:text-base line-clamp-1">
                        {item.name || item.cakeName || "Vintage Cake"}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-500">
                      ฿{(item.totalPrice || item.price || 0).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="divider my-2"></div>

          {/* 💰 สรุปยอดรวม */}
          <div className="flex justify-between items-center px-2 py-2">
            <span className="text-lg text-gray-600 font-semibold">Total Amount</span>
            <span className="text-3xl font-black text-pink-500">
              ฿{(totalPrice || 0).toLocaleString()}
            </span>
          </div>

          {/* 🚀 ปุ่ม Pay Now */}
          <div className="card-actions mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="btn w-full bg-pink-500 hover:bg-pink-600 border-none text-white text-lg rounded-xl shadow-lg shadow-pink-200"
            >My Orders
              
            </motion.button>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}