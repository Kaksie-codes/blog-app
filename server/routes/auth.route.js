import { Router } from 'express';
import { 
    signupUser, 
    signinUser, 
    signoutUser, 
    googleAuth, 
    generateOTP, 
    verifyOTP, 
    resetPassword,
    resendOTP,
    adminRoute,  
    verifyUser,
    resendVerificationEmail  
} from '../controllers/auth.controller.js';
// import verifyUser from '../middleware/user.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import isAdmin from '../middleware/admin.middleware.js';

// Initialize the router
const router = Router();

// Signup
router.post('/signup', signupUser);

// Signin
router.post('/signin', signinUser);

// Signout
router.get('/signout', signoutUser);

// generate OTP
router.post('/generateOTP', generateOTP);

// verify OTP
router.post('/verifyOTP', verifyOTP);

// resend verification Mail
router.get('/resendVerificationMail/:id', resendVerificationEmail);

// verify User
router.get('/:id/verify/:token', verifyUser);

// Create or Reset Session
router.get('/resendOTP', resendOTP);

// Google Auth
router.post('/google-auth', googleAuth);

// private routes
router.post('/resetPassword', protect, resetPassword);

// Admin routes
router.get('/admin', protect, isAdmin,  adminRoute);





export default router;