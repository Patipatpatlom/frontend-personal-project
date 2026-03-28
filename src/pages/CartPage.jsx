import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">No items in cart</p>
      ) : (
        <>
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

          {/* TOTAL */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xl font-bold">
              Total: {totalPrice.toLocaleString()} บาท
            </p>

            <button
              onClick={() => navigate("/payment")}
              className="mt-4 w-full bg-pink-500 text-white py-3 rounded-xl"
            >
              Checkout 💳
            </button>
          </div>
        </>
      )}
    </div>
  );
}