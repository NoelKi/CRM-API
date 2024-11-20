import { Router } from 'express';
import { users } from '../fake-db/user.data';
import { Users } from '../models';

const router = Router();

// helpfunction
router.get('/fillDb', async (req, res) => {
  try {
    await Users.insertMany(users);
    res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
  } catch (error) {
    console.error('Fehler beim Befüllen der Datenbank:', error);
    res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
  }
});

// Route: GET /api/users
router.get('/users', async (req, res) => {
  let filter = (req.query.filter as string) || '';
  const pageSize = Number(req.query.pageSize) || 5;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const sortField = (req.query.sortField as string) || '_id';
  const sortDirection = (req.query.sortDirection as 'asc' | 'desc') || 'desc';
  const filterArr = splitFilter(filter);
  const $and = filterArr.map((word) => ({
    $or: [
      { firstName: { $regex: word, $options: 'i' } },
      { lastName: { $regex: word, $options: 'i' } },
      { email: { $regex: word, $options: 'i' } },
      { street: { $regex: word, $options: 'i' } }
    ]
  }));

  try {
    // Baue die Query auf
    const filteredUsers = await Users.find({ $and })
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      .sort({ [sortField]: sortDirection });

    const totalLength = await Users.countDocuments({ $and });
    res.send({ users: filteredUsers, totalLength });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error while user fetching' });
    return;
  }
});

function splitFilter(filterValue: string) {
  return filterValue.split(' ');
}

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

// Route: Post /api/login
router.post('/login', async (req, res) => {
  const userLogin = new Users(req.body);
  try {
    const user = await Users.findOne({ email: userLogin.email, password: userLogin.password });
    res.send({ user });
  } catch (error) {
    console.log('Not Worked In');

    console.log(error);
    res.send({ status: 'Error' });
  }
});

// Exportieren des Routers
export default router;
