import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function CartPage() {
    
      const { cart, removeFromCart, clearCart } = useCart();
    
    const location = useLocation()
    const { order } = location.state || {};
    // const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem("my_cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   useEffect(() => {
//     if (order) {
//       setCart((prev) => {
//         // เช็คก่อนว่ามีของชิ้นนี้อยู่แล้วหรือยัง (กัน duplication ตอน reload)
//         const isExist = prev.find(item => item.cake_id === order.cake_id);
//         if (isExist) return prev; 
        
//         const updatedCart = [...prev, order];
//         localStorage.setItem("my_cart", JSON.stringify(updatedCart));
//         return updatedCart;
//       });
//     }
//   }, [order]);

  console.log(cart)
  const navigate = useNavigate();

  // 🧠 กันพัง + คำนวณ total
  const totalPrice = (cart ?? []).reduce((sum, item) => {
    return sum + (item.totalPrice ?? 0) * (item.quantity ?? 1);
  }, 0);
// console.log(totalPrice)
  // 💳 CHECKOUT
  const handleCheckout = async () => {
    try {
    //   const token = localStorage.getItem("token");

    //   const res = await fetch("http://localhost:5000/api/orders", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       address: "Cake Land 💖",
    //       items: cart.map((item) => ({
    //         cakeId: item.cake_id,
    //         quantity: item.quantity ?? 1,
    //       })),
    //     }),
    //   });

    //   const data = await res.json();
      
      navigate("/payment");
    //   if (!res.ok) {
    //     alert(data.message || "Checkout failed 💀");
    //     return;
    //   }

    //   alert("Order created 🎉");

    //   // 🧹 ล้างตะกร้า
    //   clearCart();

    //   // 👉 ไป payment
 } catch (err) {
    //     console.error(err);
    //     alert("Checkout failed 💀");
}
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {!cart || cart.length === 0 ? (
        <p className="text-gray-400">No items in cart 💀</p>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cake_id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
              >
                <div>
                  <p className="font-bold">{item.cakeName ?? "Unknown item"}</p>

                  <p className="text-sm text-gray-500">
                    {item.quantity ?? 1} x {(item.totalPrice ?? 0).toLocaleString()}{" "}
                    บาท
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.cake_id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xl font-bold">
              Total: {totalPrice.toLocaleString()} บาท
            </p>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-pink-500 text-white py-3 rounded-xl hover:scale-[1.02] transition"
            >
              Checkout 💳
            </button>
          </div>
        </>
      )}
    </div>
  );
}
