import { Schema } from 'mongoose';

export const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  passwordSalt: { type: String },
  isAdmin: { type: Boolean },
  pictureUrl: { type: String }
});

export interface IUser {
  email: string;
  password: string;
  passwordSalt: string;
  isAdmin: boolean;
  pictureUrl: string;
}
