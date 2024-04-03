import { Router } from 'express';
import { 
    createBlog, 
    getLatestBlogPosts, 
    getLikeStatus, 
    getTrendingBlogs, 
    searchBlogPosts, 
    getBlogPost, 
    likeBlogPost,
    getAllTags } from '../controllers/blogPost.controller.js';
import { verifyToken, protect } from '../middleware/auth.middleware.js';

// Initialize the router
const router = Router();

// Create Post
router.post('/create-post', protect, createBlog); 
router.post('/latest-blogs', getLatestBlogPosts);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogPosts); 
router.post('/get-blog', getBlogPost);
router.get('/get-categories', getAllTags);
router.post('/like-blog', verifyToken, likeBlogPost);
router.post('/isliked-by-user', verifyToken, getLikeStatus);

export default router;