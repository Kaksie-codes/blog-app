import { Router } from 'express';
import { 
    createBlog, 
    getLatestBlogPosts, 
    getLikeStatus, 
    getTrendingBlogs, 
    searchBlogPosts, 
    getBlogPost, 
    likeBlogPost } from '../controllers/blogPost.controller.js';
import { verifyToken1, verifyToken } from '../middleware/verifyToken.js';

// Initialize the router
const router = Router();

// Create Post
router.post('/create-post', verifyToken1, createBlog);
router.post('/latest-blogs', getLatestBlogPosts);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogPosts);
router.post('/get-blog', getBlogPost);
router.post('/like-blog', verifyToken, likeBlogPost);
router.post('/isliked-by-user', verifyToken, getLikeStatus);

export default router;