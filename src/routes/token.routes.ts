import { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import environment from '../environments/environment';
import { RefreshTokens } from '../models';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshTokenValidity
} from '../utils/jwt.utils';

// const jwt = require('jsonwebtoken');

const router = Router();
const JWT_SECRET = environment.JWT_SECRET;

router.post('/refresh', async (req, res) => {
  console.log('Start Refresh Route');

  const refreshToken = req.cookies.refreshToken;
  const user_id = req.body.user_id;

  console.log('routerHeader', user_id);

  if (!refreshToken) {
    res.sendStatus(401);
  }

  const decode = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
  // any has to be changed at the moment when refreshtoken payload is correct set
  if (!decode) {
    res.sendStatus(403);
  }

  // extract payload
  const payload = decode.payload;

  const val = await verifyRefreshTokenValidity(refreshToken);
  //implement token verification here
  if (!val) {
    res.sendStatus(403);
  }

  // delete old refreshToken
  const whatever = await RefreshTokens.deleteOne({ refreshToken: refreshToken });
  console.log('whatever', whatever);

  // console.log('payload', payload);

  const newRefreshToken = await createRefreshToken(payload, user_id);
  const accessToken = createAccessToken(payload);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    path: '/'
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
  res.status(200).json({ accessToken });
});

export default router;
