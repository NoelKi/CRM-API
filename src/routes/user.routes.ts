import { Router } from 'express';
import { users } from '../fake-db/user.data';
import { Users } from '../models';

const router = Router();

// ---------- helpfunctions --------

router.get('/fillUsers', async (req, res) => {
  try {
    await Users.insertMany(users);
    res.status(200).send({ message: 'Datenbank erfolgreich befüllt' });
  } catch (error) {
    console.error('Fehler beim Befüllen der Datenbank:', error);
    res.status(500).send({ message: 'Fehler beim Befüllen der Datenbank', error });
  }
});

router.get('/test', async (req, res) => {
  res.send({ success: true, message: 'anyways' });
});

// ---------- helpfunctions ----------

export default router;
