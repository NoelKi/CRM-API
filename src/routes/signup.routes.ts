import { Router } from 'express';

const router = Router();

router.post('/testCookie', async (req, res) => {
  console.log(req.cookies);
  res.clearCookie('refreshToken');

  res.sendStatus(200);
});

export default router;
