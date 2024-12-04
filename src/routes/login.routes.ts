import { Request, Response, Router } from 'express';

import environment from '../environments/environment';
import { Users } from '../models';
import { calculatePasswordHash } from '../utils/hash.utils';
import { createAccessToken, createRefreshToken } from '../utils/jwt.utils';

const jwt = require('jsonwebtoken');
const JWT_SECRET = environment.JWT_SECRET;

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
    const user = await Users.findOne({ email: email });

    if (!user) {
      const message = `login denied`;
      console.error(`${message} - ${email}`);
      return;
    }

    // 2. pw to hash
    const passwordHash = await calculatePasswordHash(password, user.passwordSalt);

    if (passwordHash != user.password) {
      const message = `login denied`;
      console.error(`${message} - user with ${email} has entered the wrong password.`);
      return;
    }

    const { pictureUrl, isAdmin } = user;

    // 4. jsonWt generieren
    const jwtAuthPayload = {
      user_id: user._id,
      email,
      isAdmin
    };
    const accessToken = createAccessToken(jwtAuthPayload);
    const refreshToken = await createRefreshToken(jwtAuthPayload);

    // 5. send to frontend
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      user: {
        email,
        pictureUrl,
        isAdmin
      },
      accessToken
    });
  } catch (error) {
    console.log(error);
    res.send({ status: 'Error' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  });
  res.json({ message: 'Logout erfolgreich!' });
});

// Exportieren des Routers
export default router;
