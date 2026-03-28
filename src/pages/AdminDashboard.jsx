import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ===================== FETCH ORDERS =====================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  // ===================== UPDATE STATUS =====================
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders(); // refresh
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-5 text-xl">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 Admin Dashboard</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(order.id, "pending")}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(order.id, "done")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Done
              </button>

              <button
                onClick={() => updateStatus(order.id, "cancel")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}