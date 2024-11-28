import environment from '../environments/environment';

const JWT_SECRET = environment.JWT_SECRET;
const jwt = require('jsonwebtoken');

export async function checkJwtValidity(authJwtToken: string) {
  const payload = await jwt.verify(authJwtToken, JWT_SECRET);
  console.log('verification');

  console.log('Found user details in JWT: ', payload);

  return payload;
}

export function checkIfJwtIsExpired(exp: number): boolean {
  return exp * 1000 < Date.now();
  // return true;
}

export async function createAccessToken<T>(payload: T) {
  const accessToken = await jwt.sign({ payload }, JWT_SECRET, { expiresIn: '15m' });
  console.log('accessToken', accessToken);
  return accessToken;
}

export async function createRefreshToken<T>(payload: T) {
  const refreshToken = await jwt.sign({ payload }, JWT_SECRET, { expiresIn: '7d' });
  console.log('refreshToken', refreshToken);
  return refreshToken;
}

export async function refreshAccessToken() {}
