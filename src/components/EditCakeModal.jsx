import React from "react";
import { motion } from "framer-motion";

export default function EditCakeModal({ editing, setEditing, onSave }) {
  if (!editing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white p-6 rounded-3xl w-80 shadow-2xl border border-pink-100"
      >
        <h2 className="text-xl font-bold mb-4 text-pink-600">Edit Cake 🎂</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-400">Name</label>
            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400">Price (฿)</label>
            <input
              type="number"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: e.target.value })
              }
              className="input input-bordered w-full mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setEditing(null)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="btn bg-pink-500 hover:bg-pink-600 text-white border-none flex-1 shadow-md"
          >
            Save 💾
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
