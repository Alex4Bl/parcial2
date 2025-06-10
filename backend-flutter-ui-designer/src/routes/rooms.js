const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

// Crear nueva sala
router.post('/', auth, roomController.createRoom);

// Obtener todas las salas del usuario
router.get('/', auth, roomController.getRooms);

// Obtener una sala por ID
router.get('/:id', auth, roomController.getRoomById);

// Actualizar sala
router.put('/:id', auth, roomController.updateRoom);

// Compartir sala con otro usuario
router.post('/:id/share', auth, roomController.shareRoom);

// Unirse a sala por código
router.post('/join', auth, roomController.joinRoom);

// Eliminar sala
router.delete('/:id', auth, roomController.deleteRoom);

module.exports = router;