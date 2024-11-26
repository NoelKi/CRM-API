import { NextFunction, Request, Response } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  console.log('should be user', user.isAdmin);

  if (!user.isAdmin) {
    console.error('The user is not an admin, access denied');
    res.sendStatus(403);
    return;
  }
  next();
}
