import { Users } from '../models';

export const users = [
  new Users({
    email: 'kieran.noel@icloud.com',
    password: '123',
    passwordSalt: '1234',
    isAdmin: true,
    pictureUrl: 'urls'
  })
];
