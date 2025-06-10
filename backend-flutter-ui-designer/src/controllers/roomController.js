const Room = require('../models/Room');
const User = require('../models/User');

// Generar código aleatorio para sala
const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Crear nueva sala
exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    
    const room = new Room({
      name,
      owner: req.userId,
      accessCode: generateRandomCode(6),
      views: [{
        id: Date.now().toString(),
        name: 'Vista Principal',
        components: []
      }]
    });
    
    await room.save();
    
    res.status(201).json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener todas las salas del usuario
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { owner: req.userId },
        { collaborators: req.userId }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(rooms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener una sala por ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
    
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Verificar si el usuario tiene acceso a la sala
    if (room.owner.toString() !== req.userId && 
        !room.collaborators.some(collab => collab._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    res.json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar sala
exports.updateRoom = async (req, res) => {
  try {
    const { name, views } = req.body;
    
    let room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Verificar si el usuario tiene acceso a la sala
    if (room.owner.toString() !== req.userId && 
        !room.collaborators.some(collab => collab.toString() === req.userId)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Actualizar campos
    if (name) room.name = name;
    if (views) room.views = views;
    room.updatedAt = Date.now();
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Compartir sala con otro usuario
exports.shareRoom = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar sala
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Verificar si el usuario es el propietario
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Solo el propietario puede compartir la sala' });
    }
    
    // Buscar usuario por email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si ya está compartida con este usuario
    if (room.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'La sala ya está compartida con este usuario' });
    }
    
    // Agregar colaborador
    room.collaborators.push(user._id);
    await room.save();
    
    res.json({ message: 'Sala compartida exitosamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Unirse a sala por código
exports.joinRoom = async (req, res) => {
  try {
    const { accessCode } = req.body;
    
    // Buscar sala por código
    const room = await Room.findOne({ accessCode });
    
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Verificar si ya es colaborador
    if (room.collaborators.includes(req.userId)) {
      return res.status(400).json({ message: 'Ya eres colaborador en esta sala' });
    }
    
    // Agregar como colaborador
    room.collaborators.push(req.userId);
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar sala
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Verificar si el usuario es el propietario
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Solo el propietario puede eliminar la sala' });
    }
    
    // Cambiar room.remove() por el método actual
    await Room.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Sala eliminada' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};