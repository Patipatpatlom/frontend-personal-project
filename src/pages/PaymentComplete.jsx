import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentComplete() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 font-sans">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-[50px] p-12 shadow-2xl text-center border-4 border-white">
        
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl mb-6">
          🎉
        </motion.div>
        
        <h2 className="text-4xl font-black text-[#83002D] mb-4 italic">SUCCESS!</h2>
        <p className="text-gray-500 font-bold mb-10">เราได้รับออเดอร์สุดหวานของคุณแล้ว เตรียมตัวรอรับความอร่อยได้เลย!</p>
        
        <button onClick={() => navigate('/home')}
          className="w-full py-5 bg-[#83002D] text-white rounded-3xl font-black text-xl shadow-xl hover:bg-black transition-all">
          BACK TO HOME
        </button>
      </motion.div>
    </div>
  );
}