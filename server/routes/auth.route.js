import { Router } from 'express';
import { signupUser, signinUser, signoutUser, googleAuth, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

// Initialize the router
const router = Router();

// Signup
router.post('/signup', signupUser);
// Signin
router.post('/signin', signinUser);
// Signout
router.get('/signout', signoutUser);
// Google Auth
router.post('/google-auth', googleAuth);
router.get('/get', verifyToken,  getMe);

export default router;