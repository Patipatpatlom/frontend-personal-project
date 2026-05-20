import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingFlowers() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * width }}
          animate={{ y: "110vh", rotate: 360 }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          className="absolute text-pink-300 text-xl"
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}
