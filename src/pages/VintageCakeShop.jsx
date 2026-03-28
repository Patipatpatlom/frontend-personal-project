import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer.jsx";

// 🧁 DATA
const cakesData = [
  { id: 1, name: 'Pink Vintage', price: 850, image: 'https://images.unsplash.com/photo-1578985543162-ea9956926578?q=80&w=300&auto=format&fit=crop' },
  { id: 2, name: 'Gold Vintage', price: 850, image: 'https://images.unsplash.com/photo-1531238612147-380d38e219fb?q=80&w=300&auto=format&fit=crop' },
  { id: 3, name: 'Creamy White', price: 850, image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=300&auto=format&fit=crop' },
  { id: 4, name: 'Strawberry Field', price: 950, image: 'https://images.unsplash.com/photo-1563214316-25867375276e?q=80&w=300&auto=format&fit=crop' },
];

// 🎀 HEADER (มีปุ่ม Cart แล้ว)
const Header = ({ setIsCartOpen, cartCount }) => (
  <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-pink-500">Real or Cake?</h1>

    {/* 🛒 CART BUTTON */}
    <button 
      onClick={() => setIsCartOpen(true)} 
      className="text-2xl relative"
    >
      🛒
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {cartCount}
        </span>
      )}
    </button>
  </header>
);

// 🍰 CARD
const CakeCard = ({ cake, onSelect }) => (
  <motion.div whileHover={{ y: -10 }} className="bg-white p-6 rounded-2xl shadow">
    <img src={cake.image} className="w-40 h-40 object-cover rounded-full mx-auto" />
    <h3 className="text-center font-bold mt-3">{cake.name}</h3>
    <p className="text-center text-pink-500">{cake.price} บาท</p>

    <button
      onClick={() => onSelect(cake)}
      className="w-full mt-3 bg-pink-500 text-white py-2 rounded-xl"
    >
      Select
    </button>
  </motion.div>
);

// 💀 MAIN
export default function VintageCakeShop() {
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, cart } = useCart();

  // 🛒 Drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { date, time } = location.state || {};

  // 🎯 เลือกเค้ก
  const handleSelectCake = (cake) => {
    addToCart({
      cake_id: cake.id,
      name: cake.name,
      price: cake.price,
    });

    navigate("/custom", {
      state: { cake, date, time },
    });
  };

  return (
    <div className="min-h-screen bg-pink-50">

      {/* HEADER */}
      <Header 
        setIsCartOpen={setIsCartOpen} 
        cartCount={cart.length} 
      />

      {/* CAKE GRID */}
      <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {cakesData.map((cake) => (
          <CakeCard key={cake.id} cake={cake} onSelect={handleSelectCake} />
        ))}
      </div>

      {/* 🛒 DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
      />

    </div>
  );
}