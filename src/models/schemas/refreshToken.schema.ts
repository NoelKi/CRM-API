import { Schema } from 'mongoose';

export const refreshTokenSchema = new Schema({
  refreshToken: { type: String },
  userId: { type: Number },
  status: { type: String }
});

export interface IRefToken {
  refreshToken: string;
  userId: number;
  status: string;
}
