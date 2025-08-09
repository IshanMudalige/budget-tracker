import React, { useRef } from "react";

const months = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Apr", value: 4 },
  { label: "May", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Aug", value: 8 },
  { label: "Sep", value: 9 },
  { label: "Oct", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Dec", value: 12 },
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
        className="z-10 bg-white shadow rounded-full px-3 py-1"
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
              key={month.value}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-1 rounded-lg whitespace-nowrap ${selectedMonth?.value === month.value
                  ? "bg-purple-500 text-white font-semibold shadow"
                  : "bg-gray-200 text-gray-600"
                }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={scrollRight}
        className="z-10 bg-white shadow rounded-full px-3 py-1"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default MonthSelector;