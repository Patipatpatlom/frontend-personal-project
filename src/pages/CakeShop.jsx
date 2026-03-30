import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const BASE_URL = "http://localhost:5000";


export default function CakeShop(props) {
    const [cakes, setCakes] = useState([]);
 
    useEffect(() => {
        getCakes();
    }, []);
    
    const getCakes = async () => {
        const res = await axios.get(`${BASE_URL}/api/desserts`);
        setCakes(res.data);
    };
    
    return (
        <div className="p-6 grid grid-cols-3 gap-6">
      {cakes.map((cake) => (
          <div key={cake.id} className="bg-white p-4 rounded-xl shadow">

          <img
            src={`${BASE_URL}${cake.image}`}
            className="h-40 w-full object-cover rounded-lg"
            />

          <h2 className="text-lg font-bold mt-2">{cake.name}</h2>
          <p className="text-pink-500">{cake.price} ฿</p>

        </div>
      ))}
    </div>
  );
}