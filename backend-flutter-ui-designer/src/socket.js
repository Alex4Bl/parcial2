import { io } from 'socket.io-client';
// Eliminar esta línea ya que es para el frontend
// import { useRoomStore } from '../features/rooms/store/useRoomStore';

// URL del servidor de sockets (ajustar según la configuración del backend)
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:3001';

// Instancia del socket
let socket;

// Inicializar la conexión del socket
const initSocket = () => {
  socket = io(SOCKET_SERVER_URL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Conexión establecida con el servidor de sockets');
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión con el servidor de sockets:', error);
  });

  return socket;
};

// Obtener la instancia del socket
const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

// Unirse a una sala específica
const joinRoom = (roomId) => {
  const socket = getSocket();
  socket.emit('join_room', { roomId });
  console.log(`Unido a la sala: ${roomId}`);
};

// Salir de una sala
const leaveRoom = (roomId) => {
  const socket = getSocket();
  socket.emit('leave_room', { roomId });
  console.log(`Salido de la sala: ${roomId}`);
};

// Enviar actualizaciones de componentes
const sendComponentUpdate = (roomId, viewId, componentId, updates) => {
  const socket = getSocket();
  socket.emit('component_update', {
    roomId,
    viewId,
    componentId,
    updates,
  });
};

// Enviar actualizaciones de vistas
const sendViewUpdate = (roomId, viewId, updates) => {
  const socket = getSocket();
  socket.emit('view_update', {
    roomId,
    viewId,
    updates,
  });
};

// Eliminar el hook de React ya que es para el frontend
export const useSocket = (roomId) => {
  const { 
    updateComponent, 
    updateComponentPosition, 
    updateComponentProperties,
    updateViewBackground,
    addComponent,
    removeComponent
  } = useRoomStore();

  const setupSocketListeners = () => {
    const socket = getSocket();

    // Unirse a la sala al montar el componente
    joinRoom(roomId);

    // Escuchar actualizaciones de componentes
    socket.on('component_update', ({ viewId, componentId, updates }) => {
      updateComponent(viewId, componentId, updates);
    });

    // Escuchar actualizaciones de posición
    socket.on('component_position', ({ viewId, componentId, position }) => {
      updateComponentPosition(viewId, componentId, position);
    });

    // Escuchar actualizaciones de propiedades
    socket.on('component_properties', ({ viewId, componentId, properties }) => {
      updateComponentProperties(viewId, componentId, properties);
    });

    // Escuchar actualizaciones de fondo de vista
    socket.on('view_background', ({ viewId, backgroundColor }) => {
      updateViewBackground(viewId, backgroundColor);
    });

    // Escuchar adición de componentes
    socket.on('component_add', ({ viewId, component }) => {
      addComponent(viewId, component);
    });

    // Escuchar eliminación de componentes
    socket.on('component_remove', ({ viewId, componentId }) => {
      removeComponent(viewId, componentId);
    });

    // Función de limpieza para desuscribirse de eventos
    return () => {
      socket.off('component_update');
      socket.off('component_position');
      socket.off('component_properties');
      socket.off('view_background');
      socket.off('component_add');
      socket.off('component_remove');
      leaveRoom(roomId);
    };
  };

  return {
    setupSocketListeners,
    sendComponentUpdate,
    sendViewUpdate,
  };
};

export default {
  initSocket,
  getSocket,
  joinRoom,
  leaveRoom,
  sendComponentUpdate,
  sendViewUpdate
};