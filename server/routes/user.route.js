import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';


// Initialize the router
const router = Router();

// Search for matching users
router.post('/search-users', getUsers);

// Search for specific user
router.post('/get-user', getUser);


export default router;