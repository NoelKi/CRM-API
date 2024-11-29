import { Router } from 'express';
import environment from '../environments/environment';
import { Users } from '../models';

const router = Router();
const JWT_SECRET = environment.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const userData = new Users(req.body);

  //   if (!userData) {
  //     res.sendStatus(400);
  //   }
  //   try {
  //     const newUser = await users.save();
  //     res.send({ status: 'OK', profilPicSrc: newCustomer.profilPicSrc, _id: newCustomer._id });
  //     return;
  //   } catch (error) {
  //     console.log(error);
  //     res.send({ status: 'Error' });
  //     return;
  //   }
});

export default router;
