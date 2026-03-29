import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ เพิ่มสินค้า
  const addToCart = (item) => {
    const exist = cart.find((i) => i.cakeId === item.cakeId);

    if (exist) {
      setCart(
        cart.map((i) =>
          i.cakeId === item.cakeId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // ❌ ลบสินค้า
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.cakeId !== id));
  };

  // 💰 รวมราคา
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}