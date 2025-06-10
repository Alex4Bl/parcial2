const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const { generateFlutterProject } = require('../generator/flutterBuilder');

exports.generateFlutter = async (req, res) => {
  const { room } = req.body;

  if (!room?.views) {
    return res.status(400).json({ error: 'room.views es requerido' });
  }

  const timestamp = Date.now();
  const projectDir = path.join(__dirname, `../../temp/flutter_project_${timestamp}`);
  const zipPath = `${projectDir}.zip`;

  try {
    await generateFlutterProject(room.views, projectDir);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(projectDir, false);
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, 'flutter_generated_app.zip', async () => {
        await fs.remove(projectDir);
        await fs.remove(zipPath);
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al generar Flutter project' });
  }
};
