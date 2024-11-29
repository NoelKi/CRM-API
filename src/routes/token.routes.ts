import { Router } from 'express';
import jwt from 'jsonwebtoken';
import environment from '../environments/environment';
import { createAccessToken, createRefreshToken, verifyTokenValidity } from '../utils/jwt.utils';

// const jwt = require('jsonwebtoken');

const router = Router();
const JWT_SECRET = environment.JWT_SECRET;

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
  }

  const decode = jwt.verify(refreshToken, JWT_SECRET);
  // any has to be changed at the moment when refreshtoken payload is correct set
  if (!decode) {
    res.sendStatus(403);
  }

  //implement token verification here
  if (!verifyTokenValidity(refreshToken)) {
    res.sendStatus(403);
  }

  const user = decode;
  console.log('user', user);

  const newRefreshToken = createRefreshToken(user);
  const accessToken = createAccessToken(user);
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ accessToken });
});

export default router;
