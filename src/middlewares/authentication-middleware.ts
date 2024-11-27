import { NextFunction, Request, Response } from 'express';
import { checkJwtValidity } from '../utils/jwt.utils';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authJwtToken = req.headers.authorization;

  if (!authJwtToken) {
    res.sendStatus(401);
    return;
  }

  checkJwtValidity(authJwtToken)
    .then((payload) => {
      console.log('Authentication JWT successfully decoded: ', payload);

      req.user = payload;

      next();
    })
    .catch((err) => {
      console.error('JWT-Token was not valid, access denied: ', err);

      res.sendStatus(401);
    });
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
