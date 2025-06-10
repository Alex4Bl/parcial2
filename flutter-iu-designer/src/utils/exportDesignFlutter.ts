// src/utils/exportDesignFlutter.ts
import type { RoomState } from "../features/rooms/store/types";

export const exportDesignFlutter = (roomState: RoomState) => {
  return {
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
};
