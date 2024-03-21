const { Router } = require('express');
const { signup, signin } = require('../controllers/auth.controller')

// Initialize the router
const router = Router();

// signup
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;