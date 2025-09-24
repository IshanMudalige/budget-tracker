import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed right-6 top-6 z-50 w-80 p-3 rounded shadow-lg bg-white border">
      <div className="font-semibold">Notification</div>
      <div className="text-sm mt-1">{message}</div>
    </div>
  );
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const socket = io("http://localhost:5001", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      socket.emit("registerUser", String(user.id));
    });

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      const notif = { message: data.message, date: new Date() };

      setNotifications((prev) => [notif, ...prev]);
      setToasts((prev) => [...prev, notif]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => socket.disconnect();
  }, [user]);

  const removeToast = (index) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 mr-4"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
      >
        <i className="fas fa-bell text-xl"></i>
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-40">
          <div className="p-3 border-b flex items-center justify-between">
            <strong>Notifications</strong>
          </div>
          <div className="max-h-72 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((n, idx) => (
                <div
                  key={idx}
                  className={`p-3 border-b ${
                    n.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="text-sm">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {n.date.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {toasts.map((t, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            right: 24,
            top: 20 + i * 80,
            zIndex: 60,
          }}
        >
          <Toast
            message={t.message}
            onClose={() => removeToast(i)}
          />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
