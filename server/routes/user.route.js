import { Router } from 'express';
import { 
    getUser, 
    getUsers,
    updateProfile,
    updateProfileImg,
    getAllUsers,
    searchUsers,
    deleteUser
 } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import isAdmin from '../middleware/admin.middleware.js';


// Initialize the router
const router = Router();

// Search for matching users
router.post('/search-users', getUsers);

// Search for specific user
router.post('/get-user', getUser);

// Search for specific user
router.post('/delete-user', protect, isAdmin, deleteUser);

router.post('/update-profile-img', protect, updateProfileImg);

router.post('/update-profile', protect, updateProfile)

router.post('/get-all-users', protect, isAdmin, getAllUsers)

router.get('/search-users', protect, isAdmin, searchUsers)


export default router;