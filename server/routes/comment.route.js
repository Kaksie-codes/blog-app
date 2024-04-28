 import { Router } from "express";
 import { protect } from "../middleware/auth.middleware.js";
 import { 
    createComment, 
    getCommentsByBlogId, 
    deleteComment, 
    getRepliesByParentId,
    getTotalCommentsCount
 } from "../controllers/comment.controller.js";

// Initialize the router
const router = Router();

// Create a Comment
router.post('/create-comment', protect, createComment);

// Get Comments by BlogId
router.get('/get-comments-byId/:blogId', getCommentsByBlogId);

// Get total comments count by BlogId
router.get('/get-total-comments-count-byId/:blogId', getTotalCommentsCount);

// Get replies by parentId
router.get('/get-replies-byId/:parentCommentId', getRepliesByParentId);

// delete Comments by BlogId
router.delete('/delete-comment/:commentId', protect, deleteComment);


export default router;