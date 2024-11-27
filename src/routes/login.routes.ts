import { Router } from 'express';
import { calculatePasswordHash } from '../utils/hash.utils';
import { signJwt } from '../utils/jwt.utils';

const router = Router();

// Route: Post /api/login
router.post('/login', async (req, res) => {
  // 1. validieren der anfrage
  if (!req.body.email) {
    throw 'Could not extract the email from the requrest, aborting.';
  }
  if (!req.body.password) {
    throw 'Could not extract the plain text password from the request, aborting.';
  }
  const { email, password } = req.body;

  try {
    // 3. datenbank anfrage
    // const user = await Users.findOne({ email: email });
    const user = {
      email: 'kieran.noel@icloud.com',
      password:
        '91ba5b47882a947199d792829420ec7a5f171c8398189dc445f791b7d4aba0d5f90feb58a1627b89a74ef96c8bb2faa739ff82d906e03786ae255f0624a1857b',
      passwordSalt: '1234',
      _id: 'id123',
      pictureUrl: '123',
      isAdmin: true
    };

    if (!user) {
      const message = `login denied`;
      console.error(`${message} - ${email}`);
      return;
    }

    // 2. pw to hash
    const passwordHash = await calculatePasswordHash(password, user.passwordSalt);

    console.log(passwordHash);

    if (passwordHash != user.password) {
      const message = `login denied`;
      console.error(`${message} - user with ${email} has entered the wrong password.`);
      return;
    }

    const { pictureUrl, isAdmin } = user;

    const nowDate = new Date().getTime();
    const exp = new Date(nowDate + 7 * 24 * 60 * 60 * 1000).getTime();
    console.log(exp);

    // 4. jsonWt generieren
    const jwtAuthPayload = {
      userId: user._id,
      email,
      isAdmin,
      exp
    };

    const authJwToken = await signJwt(jwtAuthPayload);
    console.log('TokeN', authJwToken);

    // 5. send to frontend
    res.status(200).json({
      user: {
        email,
        pictureUrl,
        isAdmin,
        exp
      },
      authJwToken
    });
  } catch (error) {
    console.log('Not Worked In');
    console.log(error);
    res.send({ status: 'Error' });
  }
});

// Exportieren des Routers
export default router;
