import { NextFunction, Request, Response } from 'express';
import { checkIfJwtIsExpired, checkJwtValidity } from '../utils/jwt.utils';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);

  if (!accessToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const isValid = checkJwtValidity(accessToken);

    if (checkIfJwtIsExpired(isValid.payload.exp)) {
      throw new Error('Token is expired');
    }

    req.user = isValid;

    next();
  } catch (err: any) {
    console.error('Access-Token was not valid, access denied: ', err);

    res.sendStatus(401);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
