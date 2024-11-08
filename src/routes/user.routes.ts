import { Router } from 'express';
import { users } from '../fake-db/user.data';
import { Users } from '../models';
import { IUser } from '../models/schemas/user.schema';
import { User } from '../models/user.model';

let thisUsers = users;
const router = Router();

//toDo exe Anschauen

// helpfunction
router.get('/fillDb', (req, res) => {
  console.log('trigger');
  // try {
  //   const usersWithoutId = users.map(({ id, ...user }) => user);
  //   await Promise.all(usersWithoutId.map((user) => Users.create(user)));
  //   res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
  // } catch (error) {
  //   console.error('Fehler beim Befüllen der Datenbank:', error);
  //   res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
  // }
});

// Route: GET /api/users
router.get('/users', async (req, res) => {
  const filter = (req.query.filter as string) || '';
  const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
  const pageIndex = parseInt((req.query.pageIndex as string) || '0', 10);
  const sortField = (req.query.sortField as string) || 'firstName';
  const sortDirection = req.query.sortDirection as string;

  let filteredUsers: IUser[] = [];
  let totalLength = 0;

  try {
    // Baue die Query auf
    let query = Users.find({
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } },
        { street: { $regex: filter, $options: 'i' } }
      ]
    })
      .limit(pageSize)
      .skip(pageSize * pageIndex);

    // Sortierung nur hinzufügen, wenn `sortDirection` gesetzt ist
    if (sortDirection) {
      query = query.sort({ [sortField]: sortDirection === 'desc' ? -1 : 1 });
    }

    // Führe die Query aus und speichere das Ergebnis
    filteredUsers = await query.exec();

    // Zähle die Anzahl der gefilterten Benutzer
    totalLength = await Users.countDocuments({
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Fehler beim Abrufen der Benutzer' });
    return;
  }

  // Ergebnis senden
  res.send({ users: filteredUsers, totalLength });
});

// Route: GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  let id = req.params.id;
  let user = await Users.findById({ _id: `${id}` }).exec();
  if (user) {
    res.send(user);
    return;
  }
  res.sendStatus(400);
});

// Route: POST /api/users
router.post('/users', async (req, res) => {
  // req.body.id = String(thisUsers.length);
  const user = new User(req.body);
  try {
    const newUser = await Users.create(user);
    res.send({ status: 'OK', profilPicSrc: newUser.profilPicSrc, _id: newUser._id });
  } catch (error) {
    res.send({ status: 'Error' });
  }
});

// Route: DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findOneAndDelete({ _id: `${userId}` });
    res.send({ status: 'OK' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.send({ status: 'Error' });
  }
});

// Route: PUT /api/users
router.put('/users', async (req, res) => {
  const editedUser = req.body;
  const userId = editedUser._id;
  const filter = { _id: `${userId}` };
  const update = {
    firstName: editedUser.firstName,
    lastName: editedUser.lastName,
    email: editedUser.email,
    birthDate: editedUser.birthDate,
    city: editedUser.city,
    street: editedUser.street,
    houseNumber: editedUser.houseNumber,
    postalCode: editedUser.postalCode,
    profilPicSrc: editedUser.profilePicSrc
  };
  try {
    await Users.findOneAndUpdate(filter, update);
    res.send({ status: 'OK' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.send({ status: 'Error' });
  }
});

// Exportieren des Routers
export default router;
