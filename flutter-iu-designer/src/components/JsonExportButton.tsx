import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { importDesign } from "../utils/importDesign";
import { useRoomStore } from "../features/rooms/store/useRoomStore";
import uiGenerateService from "../services/uiGenerate";
import Toast from "./Toast";

const ImportFromSketchButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setRoom } = useRoomStore();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Paso 1: enviar la imagen al backend y obtener el JSON como string
      // const jsonString = await jsonExportService.exportJsonFromImage(file);
      let rawJson = await uiGenerateService.exportJsonFromImage(file);

      // 🔍 Limpieza del string
      rawJson = rawJson.trim();
      if (rawJson.startsWith("```json")) {
        rawJson = rawJson.replace(/^```json/, "").trim();
      }
      if (rawJson.endsWith("```")) {
        rawJson = rawJson.replace(/```$/, "").trim();
      }

      // Paso 2: convertir el string a Blob y luego a File para usar tu importDesign
      const blob = new Blob([rawJson], { type: "application/json" });
      const jsonFile = new File([blob], "sketch.json", {
        type: "application/json",
      });

      // Paso 3: importar el diseño como siempre
      const importedState = await importDesign(jsonFile);
      setRoom(importedState.room);

      Toast({
        message: "¡Diseño cargado exitosamente desde el boceto!",
        type: "success",
      });
      // alert("¡Diseño cargado exitosamente desde el boceto!");
    } catch (error) {
      console.error("Error al importar desde boceto:", error);
      Toast({
        message: "Ocurrió un error al cargar el diseño.",
        type: "error",
      });
      // alert("Ocurrió un error al cargar el diseño.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label
        htmlFor="uploadSketch"
        className="cursor-pointer rounded-full w-12 h-12 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 shadow-lg"
        title="Subir boceto para generar diseño"
      >
        {loading ? (
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="white"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : (
          <FiUpload size={28} />
        )}
      </label>

      <input
        id="uploadSketch"
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImportFromSketchButton;
