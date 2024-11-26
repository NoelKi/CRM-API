import { Router } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { Customers } from '../models';

const router = Router();

// Rootpath for images
const ROOT_PATH = path.join(__dirname, '/assets/img/logos');

// Middleware for fileupload
router.use(fileUpload());

// Route: PUT /api/assets/img/logos
router.put('/assets/img/logos', (req, res) => {
  const customerId = req.body.id;
  const file = req.files?.file as UploadedFile;

  // Check whether a file has been uploaded
  if (!file) {
    res.send({
      status: 'Error',
      message: 'No file uploaded.'
    });
    return;
  }

  // Validation of customerId and filename
  if (!customerId || typeof customerId !== 'string') {
    res.send({
      status: 'Error',
      message: 'Invalid customer ID.'
    });
    return;
  }

  // Path for saving the file
  const imagePath = path.join(__dirname, 'assets', 'img', 'logos', customerId);
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

    let profilPicSrc = `/api/assets/img/logos/${customerId}/${file.name}`;

    const filter = { _id: `${customerId}` };
    const update = {
      profilPicSrc: profilPicSrc
    };

    try {
      await Customers.findOneAndUpdate(filter, update);
      res.send({
        status: 'OK',
        profilPicSrc: profilPicSrc
      });
    } catch (error) {
      return res.send({ status: 'error' });
    }
  });
});

// Route: GET /api/assets/img/logos/:customerId/:filename
router.get('/assets/img/logos/:customerId/:filename', (req, res) => {
  const { customerId, filename } = req.params;
  const filePath = path.join(ROOT_PATH, customerId, filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.sendStatus(404);
      }
    });
  } else {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.join(ROOT_PATH, 'profilPicDefault.jpg'), (err) => {
      if (err) {
        console.error('Error sending default file:', err);
        res.sendStatus(404);
      }
    });
  }
});

// Export the router
export default router;
