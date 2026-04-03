import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDateTime, useUserStore } from "../context/useDateTime";

export default function Home() {
  const navigate = useNavigate();

  const user = useUserStore(state=>state.user)
  console.log(user)

  const selectedDate = useDateTime((state) => state.selectedDate);
  const selectedTime = useDateTime((state) => state.selectedTime);
  const setSelectedDate = useDateTime((state) => state.setSelectedDate);
  const setSelectedTime = useDateTime((state) => state.setSelectedTime);
  const isLoading = useDateTime((state)=>state.isLoading)
  const setIsLoading = useDateTime((state)=>state.setIsLoading)

  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // 📅 วันในเดือน
  const getDaysInMonth = (date) => {
    return Array.from(
      {
        length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      },
      (_, i) => i + 1,
    );
  };

  // 🔄 เปลี่ยนเดือน
  const changeMonth = (offset) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1),
    );
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // ⏰ เลือกเวลา
  const handleTimeSelect = (time) => {
    setSelectedTime(time);

    if (selectedDate) {
      setTimeout(() => {
        navigate("/shop", {
          state: { date: selectedDate, time: time },
        });
      }, 1200);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center p-6 bg-[url('/src/assets/cake.png')] bg-accent-content">
      {/* HEADER */}
      <h1 className="text-4xl font-black text-[#d00050] mb-10">
        Real or Cake?
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 📅 CALENDAR */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-xl">
          <div className="flex justify-between mb-4">
            <button onClick={() => changeMonth(-1)}>{"<"}</button>
            <h2 className="font-bold">
              {viewDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button onClick={() => changeMonth(1)}>{">"}</button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(viewDate).map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`p-3 text-center cursor-pointer rounded-xl ${
                  selectedDate === day
                    ? "bg-pink-500 text-white"
                    : "bg-white hover:bg-pink-100"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* ⏰ TIME */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 p-6 rounded-[30px] shadow-xl"
            >
              <h3 className="font-bold mb-4 text-center">Pick Time</h3>

              {["09:00", "11:00", "13:00", "15:00"].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="block w-full mb-2 p-3 bg-pink-400 text-white rounded-xl"
                >
                  {time}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🎂 LOADING */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-6xl"
          >
            🎂
          </motion.div>
        </div>
      )}
    </div>
  );
}
