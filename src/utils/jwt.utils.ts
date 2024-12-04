import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import environment from '../environments/environment';
import { RefreshTokens } from '../models';

const tokenId = crypto.randomUUID();
const jwtSecretKey = environment.JWT_SECRET;
// const jwt = require('jsonwebtoken');

export function checkJwtValidity(authJwtToken: string) {
  const decoded = jwt.verify(authJwtToken, jwtSecretKey) as JwtPayload;

  return decoded;
}

export function checkIfJwtIsExpired(exp: number): boolean {
  return exp * 1000 < Date.now();
  // return true;
}

export function createAccessToken<T>(payload: T) {
  const accessToken = jwt.sign({ payload }, jwtSecretKey, { expiresIn: '10s' });
  return accessToken;
}

export async function createRefreshToken(payload: ICustomJwtPayload) {
  const refreshToken = jwt.sign({ payload, jti: tokenId }, jwtSecretKey, { expiresIn: '7d' });
  const userId = payload.user_id;
  await saveRefreshToken(refreshToken, userId);
  return refreshToken;
}

// toDo verify Token Vailidity from dB
export async function verifyRefreshTokenValidity(userToken: string) {
  const document = await RefreshTokens.findOne({ refreshToken: userToken });
  return document;
}

// fake db
async function saveRefreshToken(refreshToken: string, userId: Types.ObjectId) {
  const data = { refreshToken, user_id: userId };
  const tokenObj = new RefreshTokens(data);
  // Speichern Sie das Token-Objekt in der Datenbank
  await tokenObj.save();
}

interface ICustomJwtPayload {
  user_id: Types.ObjectId;
  email: string;
  isAdmin: boolean;
}
