import { Router } from 'express';
import { users } from '../fake-db/user.data';
import { User } from '../models/user.model';

let thisUsers = users;
const userRouter = Router();

// Route: GET /api/users
userRouter.get('/users', (req, res) => {
  const filter = (req.query.filter as string) || '';
  const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
  const pageIndex = parseInt((req.query.pageIndex as string) || '0', 10);
  const sortField = req.query.sortField as string;
  const sortDirection = (req.query.sortDirection as string) || 'asc';
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
    filteredUsers = sortingUsers(sortField, sortDirection, filteredUsers);
  }
  const start: number = pageIndex * pageSize;
  const end = start + pageSize;
  const reqUsers = filteredUsers.slice(start, end);
  const length = filteredUsers.length;
  res.send({ users: reqUsers, totalLength: length });
});

// Route: GET /api/users/:id
userRouter.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const user = thisUsers.find((user) => user.id === id);

  if (user) {
    res.send(user);
    return;
  }
  res.sendStatus(400);
});

// Route: POST /api/users
userRouter.post('/users', (req, res) => {
  req.body.id = String(thisUsers.length);
  const user = new User(req.body);
  thisUsers.push(user);
  res.send({ status: 'OK', id: user.id, profilPicSrc: user.profilPicSrc });
});

// Route: DELETE /api/users/:id
userRouter.delete('/users/:id', (req, res) => {
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

// Route: PUT /api/users
userRouter.put('/users', (req, res) => {
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

// Helpfunctions to make code more clean

// Sorting users
function sortingUsers(sortKind: string, sortDirection: string, users: User[]) {
  const field = sortKind as keyof User;

  users.sort((a, b) => {
    let fieldA = a[field];
    let fieldB = b[field];

    // Umgang mit undefined oder null
    if (fieldA === undefined || fieldA === null) fieldA = '';
    if (fieldB === undefined || fieldB === null) fieldB = '';

    if (field === 'birthDate') {
      // Konvertiere in Date-Objekte
      const dateA = new Date(fieldA);
      const dateB = new Date(fieldB);

      // Überprüfe, ob die Datumswerte gültig sind
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0; // Keine Änderung in der Sortierung bei ungültigen Daten
      }

      if (dateA.getTime() > dateB.getTime()) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (dateA.getTime() < dateB.getTime()) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      // Konvertieren in Strings für den Vergleich
      const valueA = String(fieldA).toLowerCase();
      const valueB = String(fieldB).toLowerCase();

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    }
  });
  return users;
}

// Exportieren des Routers
export default userRouter;
