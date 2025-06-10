import { useState, type ReactNode } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "../provider/ToastProvider"; //modal de mjs

interface UserCardProps {
  name: string;
  email: string;
  role?: string;
  children?: ReactNode;
  onSave?: (data: { name: string; email: string; role?: string }) => void;
  onDelete?: () => void;
}

const UserCard = ({
  name: initialName,
  email: initialEmail,
  role: initialRole,
  onSave,
  onDelete,
  children,
}: UserCardProps) => {
  const { showToast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole || "");

  const handleSave = () => {
    setEditMode(false);
    onSave?.({ name, email, role });
    showToast("Datos guardados correctamente", "success"); // <-- Agrega esto
  };

  return (
    <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-8 relative">
      {children}
      <UserCircleIcon className="h-32 w-32 text-indigo-400 mb-2" />
      <div className="text-center w-full">
        {editMode ? (
          <>
            <input
              className="text-3xl font-bold text-indigo-700 mb-2 w-full text-center bg-indigo-50 rounded py-2 px-4 outline-indigo-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="text-lg text-gray-500 mb-4 w-full text-center bg-indigo-50 rounded py-2 px-4 outline-indigo-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="text-base text-gray-400 mb-6 w-full text-center bg-indigo-50 rounded py-2 px-4 outline-indigo-300"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-indigo-700 mb-1">
              {name}
            </div>
            <div className="text-lg text-gray-500 mb-1">{email}</div>
            <div className="text-base text-gray-400 mb-6">{role}</div>
          </>
        )}
        <div className="flex justify-center gap-6 mt-4">
          {editMode ? (
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-full bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition text-base"
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-3 rounded-full bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition text-base"
            >
              Modificar
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-6 py-3 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition text-base"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
