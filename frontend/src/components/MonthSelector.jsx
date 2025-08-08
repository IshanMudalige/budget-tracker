import React, { useRef } from "react";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MonthSelector = ({ selectedMonth, setSelectedMonth }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="relative w-full flex items-center">
      <button
        onClick={scrollLeft}
        className="z-10 bg-white shadow rounded-full p-1"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <div
        ref={scrollRef}
        className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide mx-2 no-scrollbar"
      >
        <div className="inline-flex gap-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-1 rounded-full whitespace-nowrap ${month === selectedMonth
                  ? "bg-purple-500 text-white font-semibold shadow"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={scrollRight}
        className="z-10 bg-white shadow rounded-full p-1"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default MonthSelector;