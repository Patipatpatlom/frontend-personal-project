import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSelect() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const res = await axios.post("http://localhost:5000/orders", {
        items: cart,
        total: totalPrice
      });

      console.log("ORDER:", res.data);

      navigate("/payment-complete", {
        state: { order: res.data }
      });

    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <h1 className="text-3xl font-bold mb-6">Payment 💳</h1>

      <div className="bg-white p-6 rounded-xl shadow w-[300px]">
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}

        <hr className="my-3" />
        <p className="font-bold">Total: {totalPrice}</p>

        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-pink-500 text-white py-2 rounded-xl"
        >
          Pay Now 💸
        </button>
      </div>
    </div>
  );
}