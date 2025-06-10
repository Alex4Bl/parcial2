import { io, Socket } from 'socket.io-client';

// URL del servidor de sockets
const SOCKET_SERVER_URL = 'http://localhost:3001';

let socket: Socket | null = null;

// Inicializar la conexión del socket
const initSocket = (): Socket => {
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
const getSocket = (): Socket => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

// Unirse a una sala específica
const joinRoom = (roomId: string): void => {
  const socket = getSocket();
  socket.emit('join_room', { roomId });
  console.log(`Unido a la sala: ${roomId}`);
};

// Salir de una sala
const leaveRoom = (roomId: string): void => {
  const socket = getSocket();
  socket.emit('leave_room', { roomId });
  console.log(`Salido de la sala: ${roomId}`);
};

// Enviar actualizaciones de componentes
const sendComponentUpdate = (roomId: string, viewId: string, componentId: string, updates: any): void => {
  const socket = getSocket();
  socket.emit('component_update', {
    roomId,
    viewId,
    componentId,
    updates,
  });
};

// Enviar actualizaciones de posición de componentes
const sendComponentPosition = (roomId: string, viewId: string, componentId: string, position: { x: number, y: number }): void => {
  const socket = getSocket();
  socket.emit('component_position', {
    roomId,
    viewId,
    componentId,
    position,
  });
};

// Enviar actualizaciones de propiedades de componentes
const sendComponentProperties = (roomId: string, viewId: string, componentId: string, properties: any): void => {
  const socket = getSocket();
  socket.emit('component_properties', {
    roomId,
    viewId,
    componentId,
    properties,
  });
};

// Enviar actualización de fondo de vista
const sendViewBackground = (roomId: string, viewId: string, backgroundColor: string): void => {
  const socket = getSocket();
  socket.emit('view_background', {
    roomId,
    viewId,
    backgroundColor,
  });
};

// Enviar adición de componente
const sendComponentAdd = (roomId: string, viewId: string, component: any): void => {
  const socket = getSocket();
  socket.emit('component_add', {
    roomId,
    viewId,
    component,
  });
};

// Enviar eliminación de componente
const sendComponentRemove = (roomId: string, viewId: string, componentId: string): void => {
  const socket = getSocket();
  socket.emit('component_remove', {
    roomId,
    viewId,
    componentId,
  });
};

export {
  initSocket,
  getSocket,
  joinRoom,
  leaveRoom,
  sendComponentUpdate,
  sendComponentPosition,
  sendComponentProperties,
  sendViewBackground,
  sendComponentAdd,
  sendComponentRemove
};