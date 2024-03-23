import { Router } from 'express';
import { createBlog } from '../controllers/blogPost.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

// Initialize the router
const router = Router();

// Create Post
router.post('/create-post', verifyToken, createBlog);

export default router;