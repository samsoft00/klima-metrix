import { Router } from 'express';

const welcomeRoute = Router();

welcomeRoute.get('/', async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to klima-metrix api'
  });
});

export default welcomeRoute;
