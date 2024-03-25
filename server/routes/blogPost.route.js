import { Router } from 'express';
import { createBlog, getLatestBlogPosts, getTrendingBlogs, searchBlogPosts } from '../controllers/blogPost.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

// Initialize the router
const router = Router();

// Create Post
router.post('/create-post', verifyToken, createBlog);
router.post('/latest-blogs', getLatestBlogPosts);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogPosts);

export default router;