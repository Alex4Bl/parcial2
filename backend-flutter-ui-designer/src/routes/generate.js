const express = require('express');
const multer = require('multer');

const { generateJsonFromImage } = require('../controllers/generateController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/generate-json', upload.single('ui'), generateJsonFromImage);

module.exports = router;
