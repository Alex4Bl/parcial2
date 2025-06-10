import { useState } from "react";

interface TextInputModalProps {
  title: string;
  message: string;
  placeholder?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const TextInputModal = ({
  title,
  message,
  placeholder,
  onConfirm,
  onCancel,
}: TextInputModalProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <input
          type="text"
          placeholder={placeholder || "Escribe aquí..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => onConfirm(value)}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;
