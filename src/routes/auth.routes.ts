import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/signout', authorized, AuthController.signOut);

// Authorized routes
router.delete('/delete-account', authorized, AuthController.deleteAccount);

export default router;
