import React from "react";
import axios from "axios";

export default function AddCakeForm({ form, setForm, onAdd, setToast }) {
  return (
    <div className="mb-10 p-6 rounded-3xl bg-white/70 backdrop-blur-lg shadow-xl border border-white/40">
      <h2 className="text-2xl font-bold text-pink-500 mb-4">➕ Add Cake</h2>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input input-bordered"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="input input-bordered"
        />

        {/* Image Upload */}
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
                  formData
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
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl mt-1 border border-pink-200"
            />
          )}
        </div>

        {/* Category */}
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
        onClick={onAdd}
        className="mt-4 btn bg-pink-500 hover:bg-pink-600 text-white border-none w-full shadow-lg"
      >
        Add Cake 🎂
      </button>
    </div>
  );
}
