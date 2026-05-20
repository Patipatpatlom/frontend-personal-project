import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // ➕ add to cart
      addToCart: (item) => {
        set((state) => {
          const exist = state.cart.find((i) => i.cakeId === item.cakeId);

          if (exist) {
            return {
              cart: state.cart.map((i) =>
                i.cakeId === item.cakeId
                  ? { ...i, quantity: (i.quantity ?? 1) + (item.quantity ?? 1) }
                  : i
              ),
            };
          }

          return {
            cart: [...state.cart, { ...item, quantity: item.quantity ?? 1 }],
          };
        });
      },

      // ❌ remove from cart by index
      removeFromCart: (index) => {
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        }));
      },

      // 🧹 clear cart
      clearCart: () => {
        set({ cart: [] });
      },

      // 💰 computed total price (can be called as store.getState().getTotalPrice() or via hook)
      getTotalPrice: () => {
        return get().cart.reduce(
          (sum, item) => sum + (item.totalPrice ?? (item.price ?? 0)) * (item.quantity ?? 1),
          0
        );
      },
    }),
    {
      name: "cart", // local storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
