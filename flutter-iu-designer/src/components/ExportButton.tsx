import React from 'react';
import { useRoomStore } from '../features/rooms/store/useRoomStore';
import { exportDesign } from '../utils/exportDesign';

export const ExportButton: React.FC = () => {
  const roomState = useRoomStore();

  const handleExport = () => {
    try {
      exportDesign(roomState);
    } catch (error) {
      console.error('Error exporting design:', error);
      // Aquí podrías mostrar un toast o notificación de error
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Export Design
    </button>
  );
};