import { useState } from "react";
import { PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

interface SalaCardProps {
  name: string;
  createdAt: string;
  chips?: string[];
  favorite?: boolean;
  onEdit?: (newName: string) => void;
  onDelete?: () => void;
  onFavorite?: (newFavorite: boolean) => void; // Cambia aquí
  onClick?: () => void;
}

const SalaCard = ({
  name,
  createdAt,
  chips = ["A", "B", "C"],
  favorite = false,
  onEdit,
  onDelete,
  onFavorite,
  onClick,
}: SalaCardProps) => {
  const [hover, setHover] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isFavorite, setIsFavorite] = useState(favorite); // Estado local

  const handleEdit = () => {
    if (editMode && onEdit) onEdit(newName);
    setEditMode(!editMode);
  };

  const handleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavorite && onFavorite(newValue); // Notifica al padre
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Si se hizo clic en un botón (editar, eliminar, favorito), no navegar
    if ((e.target as HTMLElement).closest("button")) return;
    onClick && onClick(); // Ejecuta navegación solo si no fue en botón
  };

  return (
    <div
      className={`relative rounded-2xl bg-white/90 p-6 min-h-[140px] shadow transition-all
        ${hover ? "shadow-2xl -translate-y-2 border-t-4 border-indigo-200" : "shadow-md"}
        hover:shadow-2xl hover:-translate-y-2 hover:border-t-4 hover:border-indigo-200`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleCardClick}
    >
      {/* Edit/Delete icons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className={`p-1 rounded-full hover:bg-indigo-100 transition ${hover ? "opacity-100" : "opacity-0"} `}
          onClick={handleEdit}
          title={editMode ? "Guardar" : "Editar"}
        >
          <PencilIcon className="h-5 w-5 text-indigo-400" />
        </button>
        <button
          className={`p-1 rounded-full hover:bg-red-100 transition ${hover ? "opacity-100" : "opacity-0"} `}
          onClick={onDelete}
          title="Eliminar"
        >
          <TrashIcon className="h-5 w-5 text-red-400" />
        </button>
      </div>

      {/* Nombre editable */}
      <div className="font-bold text-indigo-700 text-lg mb-2 pr-14">
        {editMode ? (
          <input
            className="border-b border-indigo-300 outline-none bg-indigo-50 rounded px-2 py-1 w-2/3"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onBlur={handleEdit}
            autoFocus
          />
        ) : (
          name
        )}
      </div>

      {/* Fecha */}
      <div className="flex items-center text-xs text-gray-500 mb-3 gap-1">
        <span>
          <svg className="inline h-4 w-4 mr-1 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        {createdAt}
      </div>

      {/* Chips */}
      <div className="flex gap-1 mb-2">
        {chips.map((chip, idx) => (
          <span
            key={chip + idx}
            className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Favorito */}
      <button
        className="absolute bottom-4 right-4 flex items-center gap-1 text-indigo-400 hover:text-indigo-600 text-sm"
        onClick={handleFavorite}
        title="Favorito"
      >
        {isFavorite ? (
          <StarSolid className="h-5 w-5 text-indigo-400" />
        ) : (
          <StarIcon className="h-5 w-5" />
        )}
        Favorito
      </button>
    </div>
  );
};

export default SalaCard;