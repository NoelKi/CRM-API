// Import the 'express' module
import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { users } from './fake-db/user.data';
import { User } from './models/user.model';
let thisUsers = users;

// Rootpath for images
const ROOT_PATH = path.join(__dirname, '/assets/img/logos');

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(fileUpload());
app.use(express.json());

// Set the port number for the server
const port = 3000;

app.get('/api/assets/img/logos/:userId/:filename', (req, res) => {
  const { userId, filename } = req.params;
  console.log(userId, filename);

  const filePath = path.join(ROOT_PATH, userId, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.sendStatus(404);
      }
    });
  } else {
    res.sendFile(ROOT_PATH + '/profilPicDefault.jpg', (err) => {
      if (err) {
        console.error('Error sending default file:', err);
        res.sendStatus(404);
      }
    });
  }
});

app.get('/api/assets/img/logos/:id', (req, res) => {
  res.sendFile(ROOT_PATH + '/profilPicDefault.jpg', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.sendStatus(404);
    }
  });
});

app.get('/api/users', (req, res) => {
  const filter = (req.query.filter as string) || '';
  const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
  const pageIndex = parseInt((req.query.pageIndex as string) || '0', 10);
  const sortField = req.query.sortField as string;
  const sortDirection = req.query.sortDirection as string;
  let filteredUsers = thisUsers;
  if (filter) {
    filteredUsers = thisUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (sortField) {
    const validSortFields: Array<keyof User> = ['firstName', 'lastName', 'email'];
    const validSortDirections = ['asc', 'desc', ''];

    if (!validSortFields.includes(sortField as keyof User)) {
      res.status(400).send({ error: 'Invalid sort field' });
      return;
    }

    if (!validSortDirections.includes(sortDirection)) {
      res.status(400).send({ error: 'Invalid sort direction' });
      return;
    }

    const field = sortField as keyof User;
    const direction = sortDirection || 'asc';

    filteredUsers.sort((a, b) => {
      let fieldA = a[field];
      let fieldB = b[field];

      // Umgang mit undefined oder null
      if (fieldA === undefined || fieldA === null) fieldA = '';
      if (fieldB === undefined || fieldB === null) fieldB = '';

      // Konvertieren in Strings für den Vergleich
      fieldA = String(fieldA).toLowerCase();
      fieldB = String(fieldB).toLowerCase();

      if (fieldA < fieldB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const start: number = pageIndex * pageSize;
  const end = start + pageSize;
  const reqUsers = filteredUsers.slice(start, end);
  const length = filteredUsers.length;
  res.send({ users: reqUsers, totalLength: length });
});

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const user = thisUsers.find((user) => user.id === id);

  if (user) {
    res.send(user);
    return;
  }
  res.sendStatus(400);
});

app.post('/api/users', (req, res) => {
  req.body.id = String(thisUsers.length);
  const user = new User(req.body);
  thisUsers.push(user);
  res.send({ status: 'OK', id: user.id, profilPicSrc: user.profilPicSrc });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  let filter = false;
  thisUsers = thisUsers.filter(({ id }) => {
    if (userId === id) {
      filter = true;
    }
    return id !== userId;
  });
  res.send(filter ? { status: 'OK' } : { status: 'Error' });
});

app.put('/api/users', (req, res) => {
  let isEdit = false;
  const newUser = req.body;
  thisUsers = thisUsers.map((user) => {
    if (user.id == newUser.id) {
      Object.assign(user, newUser);
      isEdit = true;
    }
    return user;
  });
  res.send(isEdit ? { status: 'OK' } : { status: 'Error' });
});

app.put('/api/assets/img/logos', (req, res) => {
  const userId = req.body.id;
  const file = req.files?.file as UploadedFile;
  console.log(file.name, file);

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

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
