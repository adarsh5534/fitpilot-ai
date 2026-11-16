import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// POST /auth/refresh  — requires a valid refresh token in body
router.post('/refresh', refresh);

// POST /auth/logout   — requires valid access token (to identify the user)
router.post('/logout', authenticate, logout);

export { router as authRouter };
