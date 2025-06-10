import { useRoomStore } from "../../../features/rooms/store/useRoomStore";
import { useState } from "react";
import { ComponentSidebar } from './ComponentSidebar';

export const ViewsSidebar = () => {
  const {
    views,
    activeViewId,
    setActiveView,
    addView,
    removeView,
    updateViewName,
  } = useRoomStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (view: { id: string; name: string }) => {
    setEditingId(view.id);
    setEditName(view.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateViewName(editingId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="p-4">
      <a
        className="text-xl font-bold text-indigo-700 hover:underline cursor-pointer"
        href="/dashboard"
      >
        Flutter UI Designer
      </a>
      <h2 className="text-lg font-semibold mb-4">Views</h2>
      <button
        onClick={() => addView()}
        className="w-full mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        + Add View
      </button>
      <div className="space-y-2">
        {views.map((view) => (
          <div
            key={view.id}
            className={`group flex items-center justify-between p-3 rounded-lg transition-colors ${
              activeViewId === view.id
                ? "bg-indigo-50 border-indigo-200"
                : "hover:bg-gray-50"
            }`}
          >
            {editingId === view.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                className="flex-1 px-2 py-1 border rounded"
                autoFocus
              />
            ) : (
              <span
                onClick={() => setActiveView(view.id)}
                className="flex-1 cursor-pointer"
              >
                {view.name}
              </span>
            )}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleStartEdit(view)}
                className="p-1 text-gray-600 hover:text-indigo-600"
              >
                ✎
              </button>
              {view.id !== "main" && (
                <button
                  onClick={() => removeView(view.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <ComponentSidebar />
    </div>
  );
};
