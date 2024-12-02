import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import environment from '../environments/environment';
import { RefreshTokens } from '../models';

const tokenId = crypto.randomUUID();
const JWT_SECRET = environment.JWT_SECRET;
// const jwt = require('jsonwebtoken');

export function checkJwtValidity(authJwtToken: string) {
  const decoded = jwt.verify(authJwtToken, JWT_SECRET) as JwtPayload;

  console.log('Found user details in JWT: ', decoded);

  return decoded;
}

export function checkIfJwtIsExpired(exp: number): boolean {
  return exp * 1000 < Date.now();
  // return true;
}

export function createAccessToken<T>(payload: T) {
  const accessToken = jwt.sign({ payload }, JWT_SECRET, { expiresIn: '10s' });
  return accessToken;
}

export async function createRefreshToken<T>(payload: T, user_id: Types.ObjectId) {
  const refreshToken = jwt.sign({ payload, jti: tokenId }, JWT_SECRET, { expiresIn: '7d' });
  const save = await saveRefreshToken(refreshToken, user_id);
  console.log('save', save);

  return refreshToken;
}

// toDo verify Token Vailidity from dB
export async function verifyRefreshTokenValidity(userToken: string) {
  const token = await RefreshTokens.findOne({ refreshToken: userToken });
  console.log('token', token);
  return token;
}

// fake db
async function saveRefreshToken(refreshToken: string, user_id: Types.ObjectId) {
  const data = { refreshToken, user_id };

  // Erstellen Sie eine neue Instanz des Modells
  const tokenObj = new RefreshTokens(data);

  // Speichern Sie das Token-Objekt in der Datenbank
  const newToken = await tokenObj.save();
  return newToken;
}
