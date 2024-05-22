import express from 'express';
import * as usersControllers from '../controllers/usersControllers.js';
import authMiddleware from '../helpers/authMiddleware.js';

const router = express.Router();

router.post('/register', usersControllers.register);
router.post('/login', usersControllers.login);
router.post('/logout', authMiddleware, usersControllers.logout);
router.get('/current', authMiddleware, usersControllers.getCurrentUser);
router.patch('/', authMiddleware, usersControllers.updateSubscription);

export default router;
