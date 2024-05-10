 import { Router } from "express";
 import { protect } from "../middleware/auth.middleware.js";
 import { 
    createComment, 
    getCommentsByBlogId, 
    getTotalRepliesCountByParentId,
    deleteComment, 
    getRepliesByParentId,
    getTotalCommentsCount,
    editComment,
    likeComment
 } from "../controllers/comment.controller.js";

// Initialize the router
const router = Router();

// Create a Comment
router.post('/create-comment', protect, createComment); 

// like a Comment
router.post('/like-comment', protect, likeComment); 

// Edit a Comment
router.post('/edit-comment', protect, editComment); 

// Get Comments by BlogId
router.get('/get-comments-byId/:blogId', getCommentsByBlogId);

// Get total comments count by BlogId
router.get('/get-total-comments-count-byId/:blogId', getTotalCommentsCount);

// Get replies by parentId
router.get('/get-replies-byId/:parentCommentId', getRepliesByParentId);

// Get replies by parentId
router.get('/get-total-replies-byId/:parentCommentId', getTotalRepliesCountByParentId);

// delete Comments by BlogId
router.delete('/delete-comment/:commentId', protect, deleteComment);


export default router;