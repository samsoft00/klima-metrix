import { Router } from 'express';
import welcomeRoute from './api/welcome.route';
import routes from './api/company.route';

const router = Router();

router.use('/', welcomeRoute);
router.use('/api/v1', routes);

export default router;
