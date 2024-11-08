import { Router } from 'express';
import { Users } from '../models';

const router = Router();

//toDo exe Anschauen

// helpfunction
// router.get('/fillDb', (req, res) => {
// try {
//   const usersWithoutId = users.map(({ id, ...user }) => user);
//   await Promise.all(usersWithoutId.map((user) => Users.create(user)));
//   res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
// } catch (error) {
//   console.error('Fehler beim Befüllen der Datenbank:', error);
//   res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
// }
// });

// Route: GET /api/users
router.get('/users', async (req, res) => {
  const filter = (req.query.filter as string) || '';
  const pageSize = Number(req.query.pageSize) || 5;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const sortField = (req.query.sortField as string) || '_id';
  const sortDirection = (req.query.sortDirection as 'asc' | 'desc') || 'desc';
  const $or = [
    { firstName: { $regex: filter, $options: 'i' } },
    { lastName: { $regex: filter, $options: 'i' } },
    { email: { $regex: filter, $options: 'i' } },
    { street: { $regex: filter, $options: 'i' } }
  ];

  try {
    // Baue die Query auf
    const filteredUsers = await Users.find({ $or })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({ [sortField]: sortDirection });

    const totalLength = await Users.countDocuments({ $or });
    res.send({ users: filteredUsers, totalLength });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error while user fetching' });
    return;
  }
});

// Route: GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  let user = await Users.findById(req.params.id);
  if (user) {
    res.send(user);
    return;
  }
  res.status(404).send({ error: 'Error user not found' });
});

// Route: POST /api/users
router.post('/users', async (req, res) => {
  const user = new Users(req.body);
  try {
    const newUser = await user.save();
    res.send({ status: 'OK', profilPicSrc: newUser.profilPicSrc, _id: newUser._id });
    return;
  } catch (error) {
    console.log(error);
    res.send({ status: 'Error' });
    return;
  }
});

// Route: DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await Users.findOneAndDelete({ _id: `${userId}` });
    res.send({ status: 'OK' });
    return;
  } catch (error) {
    console.error('Error deleting user:', error);
    res.send({ status: 'Error' });
    return;
  }
});

// Route: PUT /api/users
router.put('/users', async (req, res) => {
  const editedUser = req.body;
  try {
    await Users.findOneAndUpdate({ _id: `${editedUser._id}` }, editedUser);
    res.send({ status: 'OK' });
    return;
  } catch (error) {
    console.error('Error updating user:', error);
    res.send({ status: 'Error' });
    return;
  }
});

// Exportieren des Routers
export default router;
