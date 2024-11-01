import { Router } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { users } from './fake-db/user.data';

let thisUsers = users;
const assetsRouter = Router();

// Rootpath for images
const ROOT_PATH = path.join(__dirname, '/assets/img/logos');

// Middleware für Dateiupload
assetsRouter.use(fileUpload());
// Route: PUT /api/assets/img/logos

assetsRouter.put('/assets/img/logos', (req, res) => {
  const userId = req.body.id;
  const file = req.files?.file as UploadedFile;

  // Überprüfen, ob eine Datei hochgeladen wurde
  if (!file) {
    res.send({
      status: 'Error',
      message: 'No file uploaded.'
    });
    return;
  }

  // Validierung von userId und filename
  if (!userId || typeof userId !== 'string') {
    res.send({
      status: 'Error',
      message: 'Invalid user ID.'
    });
    return;
  }

  // Pfad zum Speichern der Datei
  const imagePath = path.join(__dirname, 'assets', 'img', 'logos', userId);
  const filePath = path.join(imagePath, file.name);

  // Verzeichnis erstellen, falls es nicht existiert
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
  }

  // Datei speichern
  file.mv(filePath, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }

    // Benutzerliste aktualisieren
    let isEdit = false;
    let profilPicSrc = '';
    thisUsers = thisUsers.map((user) => {
      if (user.id === userId) {
        isEdit = true;
        user.profilPicSrc = `/api/assets/img/logos/${userId}/${file.name}`;
        profilPicSrc = user.profilPicSrc;
        console.log('uploaded File ' + isEdit);
      }
      return user;
    });

    if (!isEdit) {
      res.send({
        status: 'Error',
        message: 'No user found for upload.'
      });
      return;
    }

    res.send({
      status: 'OK',
      profilPicSrc: profilPicSrc
    });
  });
});

// Route: GET /api/assets/img/logos/:userId/:filename
assetsRouter.get('/assets/img/logos/:userId/:filename', (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(ROOT_PATH, userId, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.sendStatus(404);
      }
    });
  } else {
    res.sendFile(path.join(ROOT_PATH, 'profilPicDefault.jpg'), (err) => {
      if (err) {
        console.error('Error sending default file:', err);
        res.sendStatus(404);
      }
    });
  }
});

// Exportieren des Routers
export default assetsRouter;
