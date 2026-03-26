import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";

export default function SelectDateTime() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  // 🔐 กันไม่ได้ login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, []);

  const handleSubmit = () => {
    if (!date || !time) {
      alert("เลือกวันและเวลาก่อน!");
      return;
    }

    localStorage.setItem("pickupDate", date);
    localStorage.setItem("pickupTime", time);

    navigate("/shop");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-red-500 mb-6 drop-shadow">
        SELECTDATE 
      </h1>

      {/* CARD */}
      <div className="bg-pink-200 p-6 rounded-3xl shadow-2xl">

        {/* 📅 CALENDAR */}
        <Calendar
          onChange={setDate}
          value={date}
          className="rounded-xl border-none"
        />

        {/* ⏰ TIME */}
        <div className="mt-4">
          <select
            className="select select-bordered w-full"
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">เลือกเวลา</option>
            <option>10:00</option>
            <option>12:00</option>
            <option>14:00</option>
            <option>16:00</option>
            <option>18:00</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="btn bg-red-500 text-white w-full mt-4 rounded-xl"
        >
          ถัดไป →
        </button>
      </div>
    </div>
  );
}