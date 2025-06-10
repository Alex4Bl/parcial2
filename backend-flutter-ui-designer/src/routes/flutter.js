const express = require('express');
const router = express.Router();
const { generateFlutter } = require('../controllers/flutterController');

router.post('/generate-flutter', generateFlutter);

module.exports = router;
