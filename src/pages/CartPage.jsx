import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../context/useDateTime";

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

  const user = useUserStore(state=>state.user)

  const handleCheckout = async () => {
    try {
      const token = user.token

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: "Cake Land 💖",
          items: cart.map((item) => ({
            cakeId: item.cakeId,
            quantity: item.quantity ?? 1,
            // status: item.Status
          })),
        }),
      });

      const data = await res.json();
      console.log(data)
      
      navigate("/my-orders");
    //   if (!res.ok) {
    //     alert(data.message || "Checkout failed 💀");
    //     return;
    //   }

    //   alert("Order created 🎉");

    //   // 🧹 ล้างตะกร้า
      clearCart();

    //   // 👉 ไป payment
 } catch (err) {
        console.error(err);
    //     alert("Checkout failed 💀");
}
  };

  return (
    <div className="p-10 max-w-3xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {!cart || cart.length === 0 ? (
        <p className="text-gray-400">No items in cart 💀</p>
      ) : (
        <>
       {/* ITEMS */}
<div className="space-y-4">
  {cart.map((item, index) => (
    <div
      key={index} // ใช้ index เพื่อความแม่นยำในการระบุแถว
      className="flex gap-4 items-center bg-white p-4 rounded-xl shadow border border-pink-50"
    >
      {/* 🖼️ 1. รูปภาพเค้ก */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.image || "https://via.placeholder.com/150"} // กันพังถ้าไม่มีรูป
          alt={item.cakeName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* 📝 2. รายละเอียดข้อมูล */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-lg text-gray-800 truncate">
          {item.cakeName ?? "Unknown item"}
        </p>

        <div className="space-y-1 mt-1">
          {/* ข้อมูล Size & Date */}
          <div className="flex flex-wrap gap-x-4 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold">Size:</span> {item.size ?? "Default"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span> {item.pickupDate ?? "-"}
            </p>
          </div>

          {/* ข้อมูล Message (ถ้ามี) */}
          {item.text && (
            <p className="text-sm text-pink-500 italic truncate">
              " {item.text} "
            </p>
          )}

          {/* ราคาและจำนวน */}
          <p className="text-sm font-medium text-gray-500">
            {item.quantity ?? 1} x {(item.totalPrice ?? 0).toLocaleString()} บาท
          </p>
        </div>
      </div>

      {/* ❌ 3. ปุ่มลบ */}
      <button
        onClick={() => removeFromCart(index)}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
        title="Remove item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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
              PAY NOW 💳
            </button>
          </div>
        </>
      )}
    </div>
  );
}
