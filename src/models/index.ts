import { model } from 'mongoose';
import { customerSchema, ICustomer } from './schemas/customer.schema';

export const Customers = model<ICustomer>('customers', customerSchema);
