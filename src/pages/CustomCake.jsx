import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useDateTime } from "../context/useDateTime";

// --- Header Component ---
// const Header = () => (
//   <header className="sticky top-0 left-0 right-0 bg-white/70 backdrop-blur-md z-50 px-6 py-4 shadow-sm border-b border-pink-100 flex items-center justify-between">
//     <div className="flex items-center gap-3">
//       <h1 className="text-3xl font-bold font-['Pacifico',cursive] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
//         Real or Cake?
//       </h1>
//     </div>
//     <nav className="flex items-center gap-6 text-gray-700 font-medium">
//       {['Home', 'Cake', 'Shop', 'Contact'].map(link => (
//         <a key={link} href="#" className="hover:text-pink-500 transition">{link}</a>
//       ))}
//     </nav>
//     <div className="flex items-center gap-4 text-xl">👤 🛒</div>
//   </header>
// );

const CustomCake = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ ดึงข้อมูลเค้กที่ถูกส่งมาจากหน้า Shop
  const { cake } = location.state || {};


  const { addToCart } = useCart();

  const selectedDate = useDateTime((state) => state.selectedDate);
  const selectedTime = useDateTime((state) => state.selectedTime);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cakeDecor, setCakeDecor] = useState(true);
  const [selectedPresetText, setSelectedPresetText] = useState("make a wish");
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);

  // --- 💰 Calculation Logic ---
  const basePrice = cake?.price || 850;
  const sizeSurcharge =
    selectedSize === "SS" ? -50 : selectedSize === "L" ? 200 : 0;
  const totalPrice = (basePrice + sizeSurcharge) * quantity;

  const sizes = [
    { label: "SS (3.5-4 นิ้ว)", value: "SS" },
    { label: "M (5-6 นิ้ว)", value: "M" },
    { label: "L (8-9 นิ้ว)", value: "L" },
  ];
  const presetTexts = [
    "ไม่เขียนข้อความ",
    "hbd",
    "love you",
    "happy valentine",
    "make a wish",
    "Custom",
  ];

  const handleConfirm = (e) => {
    e.preventDefault();

    const finalOrder = {
      cakeId: cake?.id,
      cakeName: cake?.name,
      image: cake?.image,
      size: selectedSize,
      text: selectedPresetText === "Custom" ? customText : selectedPresetText,
      quantity,
      totalPrice,
      pickupDate: selectedDate,
      pickupTime: selectedTime,
    };

    console.log(cake.name);
    console.log("ADD TO CART:", finalOrder);

    addToCart(finalOrder); // 🔥 สำคัญที่สุด

    navigate("/cart", { state: { order: finalOrder } });
  };

  return (
    <div className="flex h-screen w-full bg-[url('/src/assets/cake.png')] bg-accent-content">
      {/* <Header /> */}

      <main className="max-w-7xl mx-auto pt-10 px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE: Preview */}
        <div className="sticky top-28 bg-white/80 backdrop-blur-sm rounded-[50px] p-10 border-4 border-white shadow-2xl flex flex-col items-center">
          <div className="bg-pink-100 text-pink-500 px-6 py-2 rounded-full font-black text-sm mb-8 uppercase tracking-widest">
            Preview Your Cake
          </div>

          <div className="relative group">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={
                cake?.image ||
                "https://images.unsplash.com/photo-1578985543162-ea9956926578?q=80&w=500&auto=format&fit=crop"
              }
              className="w-full max-w-[400px] aspect-square object-cover rounded-full shadow-[0_20px_50px_rgba(255,182,193,0.4)] border-8 border-white"
            />
            {/* แสดงข้อความจำลองบนหน้าเค้ก */}
            {cakeDecor && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <p className="text-white font-['Pacifico',cursive] text-2xl drop-shadow-lg -rotate-12 bg-pink-500/20 px-4 py-2 rounded-lg">
                  {selectedPresetText === "Custom"
                    ? customText || "Your Text"
                    : selectedPresetText}
                </p>
              </motion.div>
            )}
          </div>
          <h3 className="mt-8 text-2xl font-black text-gray-800 uppercase italic">
            {cake?.name || "Premium Vintage Base"}
          </h3>
        </div>

        {/* RIGHT SIDE: Options */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[50px] p-10 border-4 border-white shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-pink-100 pb-6">
            <h2 className="text-3xl font-black text-[#83002D] italic uppercase">
              Customize
            </h2>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold">
                DATE: {selectedDate || "Not Selected"}
              </p>
              <p className="text-xs text-gray-400 font-bold">
                TIME: {selectedTime || "--:--"}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          <section>
            <h3 className="font-black text-gray-800 mb-4 uppercase tracking-tighter">
              1. Select Size
            </h3>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setSelectedSize(size.value)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 
                    ${selectedSize === size.value ? "bg-[#83002D] text-white border-[#83002D] shadow-lg" : "bg-white text-gray-500 border-gray-100 hover:border-pink-200"}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </section>

          {/* Decor Toggle & Text Options */}
          <section className="space-y-4">
            <h3 className="font-black text-gray-800 uppercase tracking-tighter">
              2. Message on Cake
            </h3>
            <button
              type="button"
              onClick={() => setCakeDecor(!cakeDecor)}
              className={`w-full p-4 rounded-2xl font-bold flex items-center justify-between border-2 transition-all
                ${cakeDecor ? "border-pink-300 bg-pink-50 text-pink-600" : "border-gray-100 text-gray-400"}`}
            >
              <span>เพิ่มข้อความสุดพิเศษ</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${cakeDecor ? "border-pink-500" : "border-gray-300"}`}
              >
                {cakeDecor && (
                  <div className="w-3 h-3 bg-pink-500 rounded-full" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {cakeDecor && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {presetTexts.map((text) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => setSelectedPresetText(text)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border
                            ${selectedPresetText === text ? "bg-white border-pink-400 text-pink-600 shadow-sm" : "bg-white/50 text-gray-400 border-transparent"}`}
                      >
                        {text.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {selectedPresetText === "Custom" && (
                    <motion.input
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      type="text"
                      placeholder="พิมพ์ข้อความของคุณที่นี่..."
                      className="w-full p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-500 outline-none font-bold text-pink-600"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* BOTTOM BAR */}
          <div className="pt-8 border-t-2 border-dashed border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-inner border border-gray-100">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 font-black text-xl hover:text-pink-500"
              >
                -
              </button>
              <span className="font-black text-xl w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 font-black text-xl hover:text-pink-500"
              >
                +
              </button>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">
                Total Amount
              </p>
              <p className="text-4xl font-black text-[#83002D] italic">
                {totalPrice.toLocaleString()}.-
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto px-12 py-5 bg-[#83002D] text-white rounded-[25px] font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95 uppercase italic"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomCake;
