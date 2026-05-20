import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../lib/socket";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

        setOrders(res.data?.orders || []);
      } catch (err) {
        console.log(err);
        setError("โหลดออเดอร์ไม่สำเร็จ 💀");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // ⚡ Socket.io real-time listener for order status changes
    socket.on("ORDER_STATUS_UPDATED", (data) => {
      console.log("⚡ Real-time Order Status Update:", data);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => {
      socket.off("ORDER_STATUS_UPDATED");
    };
  }, []);

  // Helpers to render status badges
  const getStatusBadge = (status) => {
    const upper = (status || "PENDING").toUpperCase();
    switch (upper) {
      case "SUCCESS":
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case "WAITING":
      case "SHIPPED":
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-xs shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            SHIPPED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 font-bold rounded-full text-xs shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-full text-xs shadow-sm animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-pink-50">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <p className="text-pink-600 font-extrabold tracking-widest mt-4 uppercase text-xs">
          Loading Purchase History...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-rose-50 text-rose-500 p-6">
        <AlertCircle className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-outline btn-error mt-4 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/src/assets/cake.png')] bg-cover bg-center py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER HERO */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/55 backdrop-blur-xl rounded-[35px] p-8 shadow-[0_20px_50px_rgba(244,63,94,0.05)] border border-white/60 text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-pink-100/80 backdrop-blur-md px-5 py-2 rounded-full shadow-inner border border-pink-200/50 mb-5">
            <ShoppingBag className="text-pink-500 w-4.5 h-4.5" />
            <span className="text-sm font-extrabold text-gray-700">Order History</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 tracking-tight flex items-center justify-center gap-2">
            My Orders
          </h1>
          <p className="text-gray-700 mt-3 font-bold max-w-md mx-auto leading-relaxed">
            Monitor, track, and view the progress of your customized cake requests.
          </p>
        </motion.div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          <AnimatePresence>
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/70 backdrop-blur-xl p-12 rounded-[40px] shadow-xl text-center border border-white/50"
              >
                <div className="text-5xl mb-4">💀</div>
                <h3 className="text-xl font-bold text-gray-600">No orders placed yet</h3>
                <p className="text-gray-400 text-sm mt-1 mb-6">
                  Ready to satisfy your sweet tooth? Pick a date and customize your cake!
                </p>
                <a
                  href="/home"
                  className="btn bg-pink-500 hover:bg-pink-600 text-white border-none rounded-2xl shadow-lg px-8 py-3"
                >
                  Create An Order 🎂
                </a>
              </motion.div>
            ) : (
              orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-[35px] shadow-2xl border border-white/50 hover:shadow-pink-100/50 hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Row 1: Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pink-50 pb-4 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                        🎂
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">
                          Order #{order.id}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold flex items-center gap-1 uppercase tracking-wider mt-0.5">
                          <Calendar className="w-3 h-3 text-pink-400" />
                          {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Row 2: Items Grid */}
                  <div className="bg-pink-50/50 p-4 rounded-3xl mb-4 border border-pink-100/40 space-y-2">
                    <p className="text-xs font-black text-pink-400 uppercase tracking-widest mb-1">
                      Order Details
                    </p>
                    {(order.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
                      >
                        <span className="font-bold text-gray-700 text-sm flex items-center gap-2">
                          🍰 {item.cakeId?.name || "Premium Custom Cake"}
                        </span>
                        <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-3 py-1 rounded-full shadow-inner border border-pink-100">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row 3: Footer Sum */}
                  <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-sm text-gray-500 font-semibold flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-pink-500" />
                      Total Price
                    </span>
                    <span className="text-2xl font-black text-pink-600">
                      ฿{(order.totalPrice || 0).toLocaleString()}.-
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}