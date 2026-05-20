import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDateTime, useUserStore } from "../context/useDateTime";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Cake,
  User,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const selectedDate = useDateTime((state) => state.selectedDate);
  const selectedTime = useDateTime((state) => state.selectedTime);
  const setSelectedDate = useDateTime((state) => state.setSelectedDate);
  const setSelectedTime = useDateTime((state) => state.setSelectedTime);
  const isLoading = useDateTime((state) => state.isLoading);

  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // 📅 Get number of days in the current month
  const getDaysInMonth = (date) => {
    return Array.from(
      {
        length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      },
      (_, i) => i + 1
    );
  };

  // 🗓️ Get the day of the week index (0-6) of the first day of the month for proper alignment
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 🔄 Change Month
  const changeMonth = (offset) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)
    );
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // ⏰ Time Selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);

    if (selectedDate) {
      setTimeout(() => {
        navigate("/shop", {
          state: {
            date: `${viewDate.toLocaleString("default", { month: "long" })} ${selectedDate}, ${viewDate.getFullYear()}`,
            time: time,
          },
        });
      }, 1200);
    }
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const firstDayIndex = getFirstDayOfMonth(viewDate);
  const daysInMonth = getDaysInMonth(viewDate);

  // Format month & year for title
  const formattedMonthYear = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-[url('/src/assets/cake.png')] bg-cover bg-center py-16 relative">
      
      {/* WELCOME HERO CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/55 backdrop-blur-xl rounded-[35px] p-8 shadow-[0_20px_50px_rgba(244,63,94,0.1)] border border-white/60 text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-pink-100/80 backdrop-blur-md px-5 py-2 rounded-full shadow-inner border border-pink-200/50 mb-5">
          <User className="text-pink-500 w-4.5 h-4.5" />
          <span className="text-sm font-extrabold text-gray-700">
            Welcome, <span className="text-pink-600">{user?.username || user?.email || "Cake Lover"}</span>! 🍰
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 drop-shadow-sm flex items-center justify-center gap-2">
          Book Your Dream Cake <span className="animate-pulse">🎂</span>
        </h1>
        <p className="text-gray-700 mt-3 font-bold max-w-md mx-auto leading-relaxed">
          Pick your delivery date and time slot below to start customizing your premium dessert.
        </p>
      </motion.div>

      {/* CORE SCHEDULER BOARD */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl items-stretch">
        
        {/* 📅 CALENDAR CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/50 flex flex-col justify-between"
        >
          <div>
            {/* Calendar Nav */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-2xl transition shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-pink-500" />
                {formattedMonthYear}
              </h2>
              
              <button
                onClick={() => changeMonth(1)}
                className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-2xl transition shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {daysOfWeek.map((day) => (
                <span key={day} className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {day}
                </span>
              ))}
            </div>

            {/* Days Grid (Mathematically Aligned) */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty placeholder cells for day alignment */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`empty-${i}`} className="p-3" />
              ))}

              {/* Real Month Days */}
              {daysInMonth.map((day) => {
                const isSelected = selectedDate === day;
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === viewDate.getMonth() &&
                  today.getFullYear() === viewDate.getFullYear();

                return (
                  <motion.div
                    key={day}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null); // Reset time when changing date
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 text-center cursor-pointer font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center relative
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200 scale-105"
                          : isToday
                          ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                          : "bg-white hover:bg-pink-50 text-gray-700 hover:text-pink-600 border border-gray-100"
                      }`}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ⏰ TIME SLOT CONTAINER */}
        <AnimatePresence mode="wait">
          {selectedDate ? (
            <motion.div
              key="time-picker"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="w-full lg:w-[320px] bg-white/70 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/50 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 text-center tracking-tight flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  Pick Time
                </h3>
                <p className="text-xs text-gray-400 font-bold text-center mb-8 uppercase tracking-widest">
                  Available Slots
                </p>

                <div className="space-y-3">
                  {["09:00", "11:00", "13:00", "15:00"].map((time) => {
                    const isTimeSelected = selectedTime === time;
                    return (
                      <motion.button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 px-6 font-bold rounded-2xl flex items-center justify-between border transition-all shadow-sm
                          ${
                            isTimeSelected
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none shadow-lg shadow-pink-200"
                              : "bg-white text-gray-700 border-gray-100 hover:border-pink-300 hover:text-pink-600"
                          }`}
                      >
                        <span className="text-lg">{time} น.</span>
                        <span>{isTimeSelected ? "💖" : "✨"}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Summary Card */}
              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-3xl bg-pink-50 border border-pink-200 text-center"
                >
                  <p className="text-xs font-black text-pink-600 uppercase tracking-widest mb-1">
                    Booking Confirmed!
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {formattedMonthYear.split(" ")[0]} {selectedDate} @ {selectedTime}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:flex w-[320px] bg-white/40 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/30 flex-col items-center justify-center text-center text-gray-400"
            >
              <Sparkles className="w-12 h-12 text-pink-300 mb-4 animate-bounce" />
              <p className="font-bold text-gray-500">Select a Date</p>
              <p className="text-xs max-w-[200px] mt-1 text-gray-400">
                Pick a delivery date on the calendar to view available time slots.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🎂 LOADING EFFECT */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-8xl filter drop-shadow-2xl"
          >
            🎂
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-pink-600 font-extrabold text-xl mt-6 uppercase tracking-widest"
          >
            Entering Cake Shop...
          </motion.p>
        </div>
      )}
    </div>
  );
}
