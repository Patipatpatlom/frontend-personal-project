import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, ShoppingCart, Moon, Sun } from "lucide-react";

// 🔥 ใช้ component นี้ไปใส่ในหน้า /shop (VintageCakeShop)
const API = "http://localhost:5000/api/desserts";

export default function FancyShopUI() {
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [dark, setDark] = useState(false);
  const [flying, setFlying] = useState(null); // {x,y,img}
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [editing, setEditing] = useState(null);

  const fetchDesserts = async () => {
    try {
      const res = await axios.get(API);
      if (Array.isArray(res.data)) setDesserts(res.data);
      else if (res.data.data) setDesserts(res.data.data);
      else setDesserts([]);
    } catch (err) {
      console.error(err);
      setDesserts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesserts();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    setToast("Deleted item 💀");
    fetchDesserts();
  };

  const addToCart = (item, e) => {
    setCart((prev) => [...prev, item]);
    setToast("Added to cart 🛒");

    // 🔥 flying animation origin
    const rect = e.currentTarget.getBoundingClientRect();
    setFlying({ x: rect.left, y: rect.top, img: item.image });

    setTimeout(() => setFlying(null), 800);
  };

  const handleAddDessert = async () => {
  if (!form.name || !form.price || !form.image) {
    setToast("Fill all fields 💀");
    return;
  }

  try {
    await axios.post(API, {
      ...form,
      price: Number(form.price),
    });

    setToast("Added 🎂");

    setForm({
      name: "",
      price: "",
      image: "",
      category: "",
    });

    fetchDesserts();
  } catch (err) {
    console.error(err);
    setToast("Add failed 💀");
  }
};

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className="min-h-screen transition-all duration-500 
bg-gradient-to-br 
from-pink-100 via-pink-200 to-pink-300 
dark:from-pink-300 dark:via-pink-200 dark:to-pink-300
p-8"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Cake Shop
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* DARK MODE */}
            <button
              onClick={() => setDark(!dark)}
              className="btn btn-circle btn-sm"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* CART */}
            <div className="relative">
              <ShoppingCart />
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-pink-500"></span>
          </div>
        )}

        {/* GRID */}
        <div className="mb-10 p-6 rounded-3xl bg-white/70 backdrop-blur-lg shadow-xl">
          <h2 className="text-2xl font-bold text-pink-500 mb-4">➕ Add Cake</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input input-bordered"
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input input-bordered"
            />

            {/* Image */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const res = await axios.post(
                      "http://localhost:5000/api/desserts/upload",
                      formData,
                    );

                    console.log("UPLOAD RESULT:", res.data);

                    setForm((prev) => ({
                      ...prev,
                      image: res.data.image,
                    }));

                    setToast("Uploaded 📸");
                  } catch (err) {
                    console.error(err);
                    setToast("Upload failed 💀");
                  }
                }}
              />

              {form.image && (
                <img
                  src={form.image}
                  className="w-24 h-24 object-cover rounded-xl"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input input-bordered"
            />
          </div>

          <button
            type="button"
            onClick={handleAddDessert}
            className="mt-4 btn btn-primary w-full"
          >
            Add Cake 🎂
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {desserts.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/70 dark:bg-white/10 backdrop-blur-lg border border-white/30"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                  ฿ {item.price}
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-pink-600 mb-1">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{item.category}</p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => addToCart(item, e)}
                    className="btn btn-sm btn-primary"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setEditing(item)}
                    className="btn btn-xs btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-sm btn-error flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🔥 FLYING IMAGE ANIMATION */}
        <AnimatePresence>
          {flying && (
            <motion.img
              src={flying.img}
              initial={{ x: flying.x, y: flying.y, opacity: 1, scale: 1 }}
              animate={{
                x: window.innerWidth - 80,
                y: 20,
                scale: 0.3,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed w-24 h-24 object-cover rounded-xl z-50 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editing && (
            <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl w-80">
                <h2 className="text-lg font-bold mb-3">Edit Cake</h2>

                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />

                <input
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  className="input input-bordered w-full mb-4"
                />

                <button
                  onClick={async () => {
                    try {
                      await axios.put(`${API}/${editing.id}`, {
                        name: editing.name,
                        price: editing.price,
                      });

                      setToast("Updated 🎂");
                      setEditing(null);
                      fetchDesserts();
                    } catch (err) {
                      console.error(err);
                      setToast("Update failed 💀");
                    }
                  }}
                  className="btn btn-primary w-full"
                >
                  Save 💾
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔥 TOAST */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg"
              onAnimationComplete={() => setTimeout(() => setToast(null), 1500)}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
