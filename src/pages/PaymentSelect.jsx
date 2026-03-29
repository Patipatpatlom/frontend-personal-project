import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSelect() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token"); // 💀 สำคัญมาก

    const body = {
      items: cart.map((item) => ({
        cakeId: Number(item.cake_id),
        quantity: item.quantity || 1,
        price: item.price,
      })),
    };

    const res = await axios.post(
      "http://localhost:5000/api/orders",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 FIX ตรงนี้
        },
      }
    );

    console.log("ORDER:", res.data);

    navigate("/payment-complete", {
      state: { order: res.data },
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Payment failed 💀");
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <h1 className="text-3xl font-bold mb-6">Payment 💳</h1>

      <div className="bg-white p-6 rounded-xl shadow w-[320px]">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty 💀</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          ))
        )}

        <hr className="my-3" />

        <p className="font-bold">Total: {totalPrice}</p>

        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
        >
          Pay Now 💸
        </button>
      </div>
    </div>
  );
}