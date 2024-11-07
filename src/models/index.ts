import { model } from 'mongoose';
import { IUser, userSchema } from './schemas/user.schema';

export const Users = model<IUser>('users', userSchema);
