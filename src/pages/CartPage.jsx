import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  // 💀 CHECKOUT FUNCTION (ยิง backend จริง)
  const handleCheckout = async () => {
    try {
      console.log("🔥 checkout clicked");

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        // 💀 FIXED: map ให้ตรง Prisma backend
        body: JSON.stringify({
          address: "Cake Land 💖",
          items: cart.map((item) => ({
            cakeId: item.cake_id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();

      console.log("💀 ORDER CREATED:", data);

      if (!res.ok) {
        alert(data.message || "Checkout failed 💀");
        return;
      }

      alert("Order created 🎉");

      // 👉 ไปหน้า payment
      navigate("/payment");
    } catch (err) {
      console.error(err);
      alert("Checkout failed 💀");
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">No items in cart</p>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cake_id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
              >
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {item.price} บาท
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.cake_id)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL + CHECKOUT */}
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