import { Router } from 'express';
import { signup, signin, signout, googleAuth } from '../controllers/auth.controller.js';


// Initialize the router
const router = Router();

// Signup
router.post('/signup', signup);
// Signin
router.post('/signin', signin);
// Signout
router.get('/signout', signout);
// Google Auth
router.post('/google-auth', googleAuth);

export default router;