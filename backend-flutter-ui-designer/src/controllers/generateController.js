const { generateUIJsonFromImage } = require('../generator/openaiService');

exports.generateJsonFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required (form field name: ui)' });
    }

    const json = await generateUIJsonFromImage(req.file.path);

    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to generate JSON from image.' });
  }
};
