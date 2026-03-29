import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-10 text-pink-500">Loading 🍰...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-pink-500 mb-6">
        🍰 My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet 💀</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="p-4 mb-4 bg-white shadow rounded-xl">
            <div className="flex justify-between">
              <b>Order #{order.id}</b>
              <span>{order.status}</span>
            </div>

            <p className="text-sm text-gray-400">
              Total: {order.totalPrice} ฿
            </p>

            <div className="mt-2">
              {order.items.map((item) => (
                <div key={item.id}>
                  🍰 {item.cake?.name} x {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}