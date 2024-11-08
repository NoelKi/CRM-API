import { Router } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { Users } from '../models';

// let thisUsers = users;
const assetsRouter = Router();

// Rootpath for images
const ROOT_PATH = path.join(__dirname, '/assets/img/logos');

// Middleware for fileupload
assetsRouter.use(fileUpload());

// Route: PUT /api/assets/img/logos
assetsRouter.put('/assets/img/logos', (req, res) => {
  const userId = req.body.id;
  const file = req.files?.file as UploadedFile;

  // Check whether a file has been uploaded
  if (!file) {
    res.send({
      status: 'Error',
      message: 'No file uploaded.'
    });
    return;
  }

  // Validation of userId and filename
  if (!userId || typeof userId !== 'string') {
    res.send({
      status: 'Error',
      message: 'Invalid user ID.'
    });
    return;
  }

  // Path for saving the file
  const imagePath = path.join(__dirname, 'assets', 'img', 'logos', userId);
  const filePath = path.join(imagePath, file.name);

  // Create directory if it does not exist
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
  }

  // Save file
  file.mv(filePath, async (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }

    let profilPicSrc = `/api/assets/img/logos/${userId}/${file.name}`;

    const filter = { _id: `${userId}` };
    const update = {
      profilPicSrc: profilPicSrc
    };

    try {
      await Users.findOneAndUpdate(filter, update);
      res.send({
        status: 'OK',
        profilPicSrc: profilPicSrc
      });
    } catch (error) {
      return res.send({ status: 'error' });
    }
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

// Export the router
export default assetsRouter;
