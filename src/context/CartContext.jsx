import React from "react";
import { useCartStore } from "../store/useCartStore";

export const CartProvider = ({ children }) => {
  return <>{children}</>;
};

export const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Compute total price reactively using either custom cake totalPrice or dessert price
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.totalPrice ?? (item.price ?? 0)) * (item.quantity ?? 1),
    0
  );

  return { cart, addToCart, removeFromCart, clearCart, totalPrice };
};