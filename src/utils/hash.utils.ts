const crypto = require('crypto');
const util = require('util');

const hashPassword = util.promisify(crypto.pbkdf2);

export async function calculatePasswordHash(plainTextPassword: string, passwordSalt: string) {}
