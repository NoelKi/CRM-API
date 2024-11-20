import { Router } from 'express';
import { Users } from '../models';

const router = Router();

// Route: Post /api/login
router.post('/login', async (req, res) => {
  const userLogin = new Users(req.body);
  try {
    const user = await Users.findOne({ email: userLogin.email, password: userLogin.password });
    res.send(user);
  } catch (error) {
    console.log('Not Worked In');

    console.log(error);
    res.send({ status: 'Error' });
  }
});

// Exportieren des Routers
export default router;
