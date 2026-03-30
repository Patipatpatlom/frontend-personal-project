import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // ✅ โหลดจาก localStorage
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 save ทุกครั้งที่ cart เปลี่ยน
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ add to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.cakeId === item.cakeId);

      if (exist) {
        return prev.map((i) =>
          i.cakeId === item.cakeId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ❌ remove
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.cake_id !== id));
  };

  // 🧹 clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // 💰 total
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);