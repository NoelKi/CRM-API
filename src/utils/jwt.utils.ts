import jwt, { JwtPayload } from 'jsonwebtoken';
import environment from '../environments/environment';
import { refreshToken } from '../fake-db/refreshToken.data';

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
  const accessToken = jwt.sign({ payload }, JWT_SECRET, { expiresIn: '15m' });
  console.log('accessToken', accessToken);
  return accessToken;
}

export function createRefreshToken<T>(payload: T) {
  const refreshToken = jwt.sign({ payload, jti: tokenId }, JWT_SECRET, { expiresIn: '7d' });
  console.log('refreshToken', refreshToken);
  return refreshToken;
}

export async function verifyTokenValidity(userToken: string) {
  for (const element of refreshToken) {
    if (element.refreshToken === userToken) {
      if (element.status === 'expired') {
        return false;
      } else {
        return true;
      }
    }
  }
}

// export async function saveRefreshToken(refreshToken, userId) {}

// export async function deleteRefreshToken(refreshToken) {}
