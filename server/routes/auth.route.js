const { Router } = require('express');
const { signup, signin, signout, googleAuth } = require('../controllers/auth.controller')

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

module.exports = router;