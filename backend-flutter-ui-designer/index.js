const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const http = require('http');
const { Server } = require('socket.io');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/rooms', require('./src/routes/rooms'));
app.use('/api/flutter', require('./src/routes/flutter'));
app.use('/api/generate', require('./src/routes/generate'));

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Manejar eventos de socket
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Unirse a una sala
  socket.on('join_room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`);
  });

  // Salir de una sala
  socket.on('leave_room', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`Usuario ${socket.id} salió de la sala ${roomId}`);
  });

  // Actualización de componente
  socket.on('component_update', (data) => {
    socket.to(data.roomId).emit('component_update', data);
  });

  // Actualización de posición de componente
  socket.on('component_position', (data) => {
    socket.to(data.roomId).emit('component_position', data);
  });

  // Actualización de propiedades de componente
  socket.on('component_properties', (data) => {
    socket.to(data.roomId).emit('component_properties', data);
  });

  // Actualización de fondo de vista
  socket.on('view_background', (data) => {
    socket.to(data.roomId).emit('view_background', data);
  });

  // Añadir componente
  socket.on('component_add', (data) => {
    socket.to(data.roomId).emit('component_add', data);
  });

  // Eliminar componente
  socket.on('component_remove', (data) => {
    socket.to(data.roomId).emit('component_remove', data);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});