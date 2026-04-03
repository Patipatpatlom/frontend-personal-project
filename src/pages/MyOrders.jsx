import { useEffect, useState } from "react";
import axios from "axios";
import { div } from "framer-motion/client";

const BASE_URL = "http://localhost:5000";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ FIX: ดึง orders ให้ถูก field
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.log(err);
        setError("โหลดออเดอร์ไม่สำเร็จ 💀");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-10 text-pink-500">Loading 🍰...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen w-full bg-[url('/src/assets/cake.png')] bg-accent-content" >
    <div className="p-10">
      <h1 className="text-3xl font-bold text-pink-500 mb-6">
        🍰 My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet 💀</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="p-4 mb-4 bg-white shadow rounded-xl"
          >
            <div className="flex justify-between">
              <b>Order #{order.id}</b>
              <span className="text-sm text-gray-500">
                {order.status || "PENDING"}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Total: {order.totalPrice || 0} ฿
            </p>

            <div className="mt-2">
              {(order.items || []).map((item) => (
                <div key={item.id}>
                  🍰 {item.cakeId?.name || "Cake"} x {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div></div>

  );
}