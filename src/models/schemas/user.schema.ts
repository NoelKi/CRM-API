import { Schema } from 'mongoose';

export const userSchema = new Schema({
  email: { type: String },
  password: { type: String }
});

export interface IUser {
  email: string;
  password: string;
}
