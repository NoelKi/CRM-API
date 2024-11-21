import { Router } from 'express';
import { Users } from '../models';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// Route: Post /api/login
router.post('/login', async (req, res) => {
  // 1. validieren der anfrage
  if (!req.body.email) {
    throw 'Could not extract the email from the requrest, aborting.';
  }
  if (!req.body.password) {
    throw 'Could not extract the plain text password from the request, aborting.';
  }
  const { email, password } = req.body;
  try {
    // 3. datenbank anfrage
    const user = await Users.findOne({ email: email });

    if (!user) {
      const message = `login denied`;
      console.error(`${message} - ${email}`);
      return;
    }

    // 2. pw to hash
    const passwordHash = await calculatePasswordHash(password, user.passwordSalt);

    if (passwordHash != user.password) {
      const message = `login denied`;
      console.error(`${message} - user with ${email} has entered the wrong password.`);
      return;
    }

    const { pictureUrl, isAdmin } = user;
    // 4. jsonWt generieren
    const authJwt = {
      userId: user._id,
      email,
      isAdmin
    };

    const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);

    // 5. send to frontend
    res.status(200).json({
      user: {
        email,
        pictureUrl,
        isAdmin
      },
      authJwtToken
    });
  } catch (error) {
    console.log('Not Worked In');

    console.log(error);
    res.send({ status: 'Error' });
  }
});

async function calculatePasswordHash(password: string, salt: string) {
  console.log(password, salt);
  return password;
}

// Exportieren des Routers
export default router;
