import environment from '../environments/environment';

const JWT_SECRET = environment.JWT_SECRET;
const jwt = require('jsonwebtoken');

export async function checkJwtValidity(authJwtToken: string) {
  const payload = await jwt.verify(authJwtToken, JWT_SECRET);

  console.log('Found user details in JWT: ', payload);

  return payload;
}

export async function signJwt<T>(payload: T) {
  const authJwtToken = await jwt.sign(payload, JWT_SECRET);

  return authJwtToken;
}

export function checkIfJwtIsExpired(exp: number) {
  return exp < Date.now();
}
