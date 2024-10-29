// Import the 'express' module
import express from 'express';
import * as fs from 'fs';
import path from 'path';
import { users } from './fake-db/user.data';
import { User } from './models/user.model';
let thisUsers = users;

const ROOT_PATH = path.join(__dirname, '/assets/img/logos');
// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set the port number for the server
const port = 3000;

app.get('/api/assets/img/logos/:filename', (req, res) => {
  console.log(ROOT_PATH);
  const filename = req.params.filename;
  const filePath = path.join(ROOT_PATH, filename);
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

app.get('/api/users', (req, res) => {
  const filter = (req.query.filter as string) || '';
  const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
  const pageIndex = parseInt((req.query.pageIndex as string) || '0', 10);
  let filteredUsers = thisUsers;
  if (filter) {
    filteredUsers = thisUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );
  }
  const start: number = pageIndex * pageSize;
  const end = start + pageSize;
  const reqUsers = filteredUsers.slice(start, end);
  const length = thisUsers.length;
  res.send({ users: reqUsers, totalLength: length });
});

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  console.log(thisUsers);
  const user = thisUsers.find((user) => user.id === id);
  console.log(user);
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
  // res.sendStatus(filter ? 200 : 400);
  res.send(filter ? { status: 'OK' } : { status: 'Error' });
});

app.put('/api/users', (req, res) => {
  let isEdit = false;
  const newUser = req.body;
  thisUsers = thisUsers.map((user) => {
    if (user.id == newUser.id) {
      user = newUser;
      isEdit = true;
    }
    return user;
  });
  res.send(isEdit ? { status: 'OK' } : { status: 'Error' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
