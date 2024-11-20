import { model } from 'mongoose';
import { customerSchema, ICustomer } from './schemas/customer.schema';
import { IUser, userSchema } from './schemas/user.schema';

export const Customers = model<ICustomer>('customers', customerSchema);
export const Users = model<IUser>('users', userSchema);
