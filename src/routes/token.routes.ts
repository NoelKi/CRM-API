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

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  // any has to be changed at the moment when refreshtoken payload is correct set
  const decode = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
  if (!decode) {
    res.sendStatus(403);
    return;
  }

  // extract payload
  const payload = decode.payload;

  // token verification
  const val = await verifyRefreshTokenValidity(refreshToken);
  if (!val) {
    res.sendStatus(403);
    return;
  }

  // delete old refresh token
  await RefreshTokens.deleteOne({ refreshToken: refreshToken });

  const newRefreshToken = await createRefreshToken(payload);
  const accessToken = createAccessToken(payload);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.status(200).json({ accessToken });
});

export default router;
