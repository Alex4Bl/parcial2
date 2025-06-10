import type { RoomState } from "../features/rooms/store/types";

export const exportDesign = (roomState: RoomState) => {
  const designData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    room: {
      id: roomState.room?.id || '',
      name: roomState.room?.name || 'Untitled Design',
      views: roomState.views.map(view => ({
        id: view.id,
        name: view.name,
        components: view.components.map(component => ({
          id: component.id,
          type: component.type,
          x: component.x,
          y: component.y,
          width: component.width,
          height: component.height,
          properties: component.properties
        }))
      }))
    }
  };

  // Convertir a JSON y crear blob
  const jsonString = JSON.stringify(designData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Crear URL y link para descarga
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ui-design-${new Date().getTime()}.json`;
  
  // Trigger descarga
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return designData;
};