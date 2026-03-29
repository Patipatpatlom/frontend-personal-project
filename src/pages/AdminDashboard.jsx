import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ===================== FETCH ORDERS =====================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders 💀");
    } finally {
      setLoading(false);
    }
  };

  // ===================== UPDATE STATUS =====================
  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      alert("Update failed 💀");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-xl font-bold">
        Loading admin dashboard 💀...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        👑 Admin Dashboard
      </h1>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-3">{order.id}</td>
                <td className="p-3">
                  {order.user?.username || "Unknown"}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {order.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(order.id, "PENDING")
                    }
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order.id, "SHIPPED")
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Shipped
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order.id, "DONE")
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Done
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}