import { Schema } from 'mongoose';

export const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: Date },
  street: { type: String },
  houseNumber: { type: String },
  city: { type: String },
  postalCode: { type: String },
  email: { type: String },
  password: { type: String },
  profilPicSrc: { type: String, default: './api/assets/img/logos/default/profilPicDefault.jpg' }
});

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  email: string;
  profilPicSrc: string;
  password: string;
}
