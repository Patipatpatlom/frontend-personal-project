import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../lib/socket";
import {
  ShieldAlert,
  Users,
  CheckSquare,
  Package,
  RefreshCw,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  // ===================== FETCH ORDERS =====================
  const fetchOrders = async () => {
    try {
      setError("");
      const token = getToken();

      if (!token) {
        setError("No token found 💀 (login first)");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load orders 💀");
    } finally {
      setLoading(false);
    }
  };

  // ===================== UPDATE STATUS =====================
  const updateStatus = async (orderId, rawStatus) => {
    const status = rawStatus.toUpperCase();
    try {
      const token = getToken();

      await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistic locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert("Update failed 💀");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // ⚡ Socket.io listener for status changes (syncs dashboard globally)
    socket.on("ORDER_STATUS_UPDATED", (data) => {
      console.log("⚡ Real-time Order Status Sync (Admin):", data);
      setOrders((prev) =>
        prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status } : o))
      );
    });

    return () => {
      socket.off("ORDER_STATUS_UPDATED");
    };
  }, []);

  // Summary Metrics Calculations
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  const getStatusStyle = (status) => {
    const upper = (status || "PENDING").toUpperCase();
    switch (upper) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border border-emerald-300 font-extrabold shadow-sm";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border border-blue-300 font-extrabold shadow-sm";
      case "CANCELLED":
        return "bg-rose-100 text-rose-700 border border-rose-300 font-extrabold shadow-sm";
      default:
        return "bg-amber-100 text-amber-700 border border-amber-300 font-extrabold shadow-sm animate-pulse";
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <p className="text-slate-600 font-extrabold mt-4 uppercase tracking-widest text-xs">
          Entering Management Center...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-rose-50 text-rose-500 p-6">
        <ShieldAlert className="w-16 h-16 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-outline btn-error mt-4 rounded-xl"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/src/assets/cake.png')] bg-cover bg-center py-12 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* DASHBOARD HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white/70 backdrop-blur-xl p-6 rounded-[35px] shadow-lg border border-white/50"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>👑</span> Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Live status overview, tracking, and customer order management center.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn bg-pink-500 hover:bg-pink-600 border-none text-white font-bold rounded-2xl flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-98 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Feed
          </button>
        </motion.div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", count: totalCount, icon: Package, color: "text-purple-600 bg-purple-50" },
            { label: "Pending", count: pendingCount, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Shipped", count: shippedCount, icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
            { label: "Done / Completed", count: completedCount, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-md border border-white/50 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-black text-gray-800 mt-1">
                  {card.count}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ORDERS TABLE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/60 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/90 text-white text-xs font-black uppercase tracking-wider">
                  <th className="p-5 rounded-tl-[40px]">Order ID</th>
                  <th className="p-5">Customer Account</th>
                  <th className="p-5">Current Status</th>
                  <th className="p-5 rounded-tr-[40px] text-center">Update Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto text-amber-400 mb-2 animate-bounce" />
                        <span className="font-bold block text-gray-500">No active customer orders found</span>
                        <span className="text-xs text-gray-400">Updates will automatically stream here.</span>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-pink-50/50 hover:bg-pink-50/30 transition-all"
                      >
                        <td className="p-5 font-black text-slate-800">
                          #{order.id}
                        </td>

                        <td className="p-5 font-bold text-gray-700">
                          {order.user?.username || order.user?.email || "Unknown User"}
                        </td>

                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${getStatusStyle(order.status)}`}>
                            {order.status || "PENDING"}
                          </span>
                        </td>

                        <td className="p-5 flex gap-2 justify-center items-center">
                          {/* Pending Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(order.id, "pending")}
                            className="px-4 py-2 text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-800 rounded-2xl shadow-md border-none transition-all"
                          >
                            Pending
                          </motion.button>

                          {/* Shipped Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(order.id, "shipped")}
                            className="px-4 py-2 text-xs font-black bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-md border-none transition-all"
                          >
                            Shipped
                          </motion.button>

                          {/* Done/Completed Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(order.id, "completed")}
                            className="px-4 py-2 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-md border-none transition-all"
                          >
                            Done
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}