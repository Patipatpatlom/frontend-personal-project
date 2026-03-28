import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🔲 BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* 🛒 DRAWER */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed right-0 top-0 h-full w-[320px] bg-white z-50 p-6 shadow-2xl flex flex-col"
          >
            <h2 className="text-xl font-bold mb-4">Your Cart 🛒</h2>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 && (
                <p className="text-gray-400">No items yet</p>
              )}

              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cake_id)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-4 mt-4">
              <p className="font-bold mb-3">Total: {totalPrice} บาท</p>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/payment");
                }}
                className="w-full bg-pink-500 text-white py-3 rounded-xl"
              >
                Checkout 💳
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}