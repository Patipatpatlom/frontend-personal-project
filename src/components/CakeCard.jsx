import React from "react";
import { motion } from "framer-motion";
import { Trash2, Edit } from "lucide-react";

export default function CakeCard({ item, i, role, onAddToCart, onEdit, onDelete }) {
  return (
    <motion.div
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

        <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          ฿ {item.price}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold text-pink-600 mb-1 truncate">
          {item.name}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{item.category}</p>

        <div className="flex justify-between items-center gap-2">
          <button
            onClick={(e) => onAddToCart(item, e)}
            className="btn btn-sm bg-pink-500 hover:bg-pink-600 text-white border-none flex-1 shadow"
          >
            Add
          </button>

          {role === "ADMIN" && (
            <>
              <button
                onClick={() => onEdit(item)}
                className="btn btn-sm btn-warning text-white flex items-center gap-1 shadow"
                title="Edit Cake"
              >
                <Edit size={14} />
                Edit
              </button>
              
              <button
                onClick={() => onDelete(item.id)}
                className="btn btn-sm btn-error text-white flex items-center gap-1 shadow"
                title="Delete Cake"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
