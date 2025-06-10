import React, { useRef } from "react";
import { useRoomStore } from "../features/rooms/store/useRoomStore";
import { importDesign } from "../utils/importDesign";
import Toast from "./Toast";

export const ImportButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setRoom } = useRoomStore();
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedState = await importDesign(file);
      console.log("Imported state:", importedState); // Debug log

      if (!importedState.room) {
        throw new Error("Invalid room data in imported file");
        Toast({
          message: "Invalid room data in imported file",
          type: "error",
        });
      }

      // Update the store with imported data
      setRoom(importedState.room);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      Toast({
        message: "Design imported successfully!",
        type: "success",
      });
      // alert('Design imported successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Import failed:", errorMessage);
      Toast({
        message: `Failed to import design: ${errorMessage}`,
        type: "error",
      });
      // alert(`Failed to import design: ${errorMessage}`);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Import Design
      </button>
    </>
  );
};
