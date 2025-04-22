"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((title, message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
  {children}
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-4">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-start gap-3 px-5 py-3 rounded-xl shadow-xl text-sm animate-funky-slide text-white border-2
        ${toast.type === "error" ? "bg-gradient-to-r from-pink-600 to-red-600 border-pink-400" : "bg-gradient-to-r from-green-500 to-lime-500 border-lime-300"}
        `}
      >
        <span className="text-xl">
          {toast.type === "error" ? "💥" : "🚀"}
        </span>
        <div className="flex flex-col">
          <span className="font-bold uppercase tracking-wider text-[0.85rem]">
             {toast.title}
          </span>
          <span className="text-white/90">{toast.message}</span>
        </div>
      </div>
    ))}
  </div>
</ToastContext.Provider>
  );
}
