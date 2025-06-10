import { ViewsSidebar } from "./sidebar/ViewsSidebar";
// import { ComponentSidebar } from "./sidebar/ComponentSidebar";
import { Canvas } from "./canvas/Canvas";
import { PropertiesSidebar } from "./sidebar/PropertiesSidebar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useRoomStore from '../../features/rooms/store/useRoomStore';
import { useSocketEvents } from '../../hooks/useSocketEvents';
// import ImportFromSketchButton from "../../components/JsonExportButton";

const Room = () => {
  const { id } = useParams();
  const { loadRoom, isLoading, error } = useRoomStore();
  
  // Configurar eventos de socket
  useSocketEvents(id || '');
  
  useEffect(() => {
    if (id) {
      loadRoom(id);
    }
  }, [id, loadRoom]);
  
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <aside className="w-64 border-r bg-white overflow-y-auto">
          <ViewsSidebar />
        </aside>
        {/* <aside className="w-48 border-r bg-white overflow-y-auto">
          <ComponentSidebar />
        </aside> */}
        <main className="flex-1 flex justify-center items-center bg-gray-100">
          <Canvas />
        </main>
        <aside className="w-72 border-l bg-white overflow-y-auto">
          <PropertiesSidebar />
        </aside>
      </div>
    </DndProvider>
  );
};

export default Room;
