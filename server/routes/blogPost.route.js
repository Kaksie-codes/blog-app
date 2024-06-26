import { Router } from 'express';
import { 
    createBlog,
    myBlogs,      
    getLatestBlogPosts,     
    getTrendingBlogs, 
    searchBlogPosts, 
    getBlogPost, 
    likeBlogPost,
    deleteBlog,
    getAllTags } from '../controllers/blogPost.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Initialize the router
const router = Router();

// Create Post
router.post('/create-post', protect, createBlog); 
router.post('/latest-blogs', getLatestBlogPosts);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogPosts); 
router.post('/get-blog', getBlogPost);
router.get('/get-categories', getAllTags);
router.post('/like-blog', protect, likeBlogPost);;
router.post('/myBlogs', protect, myBlogs);
router.post('/delete-blog', protect, deleteBlog);


export default router;