// Import the 'express' module
import express from 'express';
import { users } from './fake-db/user.data';
let thisUsers = users;

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set the port number for the server
const port = 3000;

app.get('/users', (req, res) => {
  // Send a response to the client
  res.send(thisUsers);
});

app.post('/users', (req, res) => {
  const id = req.body.id;  
  if(thisUsers.find((user) => user.id === id)) {
    res.sendStatus(400);
    return 
  } 
  res.sendStatus(200)
  thisUsers.push(req.body)
});

app.delete('/users', (req, res) => {
  const userId = req.body.id;
  let filter = false;
  thisUsers = thisUsers.filter(({id}) => {
    if (userId === id) {
      filter = true
    }  
    return id !== userId;
  });
  res.sendStatus(filter ? 200 : 400);
});

app.put('/users', (req, res) => {
  let isEdit = false;
  const newUser = req.body;
  thisUsers = thisUsers.map((user) => {
    if (user.id == newUser.id) {
      user = newUser;
      isEdit = true;
    }
    return user;
  });
  res.sendStatus(isEdit ? 200 : 400);
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});