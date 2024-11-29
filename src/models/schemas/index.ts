import { customerSchema } from './customer.schema';
import { refreshTokenSchema } from './refreshToken.schema';
import { userSchema } from './user.schema';

export const schemas = {
  customer: customerSchema,
  user: userSchema,
  refreshToken: refreshTokenSchema
};
