import { useEffect } from "react";

export default function Alert({ type = "success", message, onClose, duration = 3000 }) {
  const baseStyles = "p-4 mb-4 rounded-lg flex justify-between items-center shadow";
  const typeStyles = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="font-bold text-lg leading-none focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
}

