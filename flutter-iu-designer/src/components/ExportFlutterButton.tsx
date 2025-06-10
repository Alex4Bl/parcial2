// src/components/ExportFlutterButton.tsx
import useRoomStore from "../features/rooms/store/useRoomStore";
import flutterService from "../services/flutterExportService";
// import flutterService from "../services/flutterService";
import { exportDesignFlutter } from "../utils/exportDesignFlutter";
import Toast from "./Toast";

const ExportFlutterButton = () => {
  const roomState = useRoomStore();

  const handleExport = async () => {
    try {
      const designJson = exportDesignFlutter(roomState);

      const zipBlob = await flutterService.exportFlutterProject(designJson);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flutter-project-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al exportar a Flutter:", error);
      Toast({
        message: "Hubo un problema al generar el proyecto Flutter.",
        type: "error",
      });
      // alert("Hubo un problema al generar el proyecto Flutter.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
    >
      Exportar a Flutter
    </button>
  );
};

export default ExportFlutterButton;
