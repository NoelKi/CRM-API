import { Schema } from 'mongoose';

export const refreshTokenSchema = new Schema({
  refreshToken: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: 'users' }
});

export interface IRefToken {
  refreshToken: string;
  user_id?: Schema.Types.ObjectId;
}
