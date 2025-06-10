import { useEffect } from 'react';
import { getSocket, joinRoom, leaveRoom } from '../services/socketService';
import useRoomStore from '../features/rooms/store/useRoomStore';

export const useSocketEvents = (roomId: string) => {
  const {
    updateComponent,
    updateComponentPosition,
    updateComponentProperties,
    updateViewBackground,
    addComponent,
    removeComponent
  } = useRoomStore();

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();
    
    // Unirse a la sala
    joinRoom(roomId);

    // Configurar listeners
    socket.on('component_update', ({ viewId, componentId, updates }) => {
      updateComponent(viewId, componentId, updates);
    });

    socket.on('component_position', ({ viewId, componentId, position }) => {
      updateComponentPosition(viewId, componentId, position);
    });

    socket.on('component_properties', ({ viewId, componentId, properties }) => {
      updateComponentProperties(viewId, componentId, properties);
    });

    socket.on('view_background', ({ viewId, backgroundColor }) => {
      updateViewBackground(viewId, backgroundColor);
    });

    socket.on('component_add', ({ viewId, component }) => {
      addComponent(viewId, component);
    });

    socket.on('component_remove', ({ viewId, componentId }) => {
      removeComponent(viewId, componentId);
    });

    // Función de limpieza
    return () => {
      socket.off('component_update');
      socket.off('component_position');
      socket.off('component_properties');
      socket.off('view_background');
      socket.off('component_add');
      socket.off('component_remove');
      leaveRoom(roomId);
    };
  }, [roomId, updateComponent, updateComponentPosition, updateComponentProperties, updateViewBackground, addComponent, removeComponent]);
};