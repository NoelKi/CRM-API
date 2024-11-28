import { Router } from 'express';
import environment from '../environments/environment';
import { createAccessToken, createRefreshToken } from '../utils/jwt.utils';
const jwt = require('jsonwebtoken');

const router = Router();
const JWT_SECRET = environment.JWT_SECRET;

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
  }

  jwt.verify(refreshToken, JWT_SECRET, async (err: Error, payload: any) => {
    // any has to be changed at the moment when refreshtoken payload is correct set
    if (err) {
      res.sendStatus(403);
      return;
    }
    console.log('payload', payload);

    const user = payload.payload;
    console.log('user', user);

    const newRefreshToken = await createRefreshToken(user);
    const accessToken = await createAccessToken(user);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  });
});

export default router;
