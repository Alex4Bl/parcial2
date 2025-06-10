import React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const colors = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

const icons = {
  success: "✔️",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => (
  <div
    className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg min-w-[220px] max-w-xs
      ${colors[type]} animate-fade-in-up`}
    style={{ marginBottom: "2.5rem" }}
  >
    <span className="text-xl">{icons[type]}</span>
    <span className="flex-1">{message}</span>
    {onClose && (
      <button
        className="ml-2 text-lg font-bold opacity-60 hover:opacity-100"
        onClick={onClose}
        title="Cerrar"
      >
        ×
      </button>
    )}
  </div>
);

export default Toast;