 import { Router } from "express";
 import { protect } from "../middleware/auth.middleware.js";
 import { createComment, getAllCommentsByBlogId } from "../controllers/comment.controller.js";

// Initialize the router
const router = Router();

// Create a Comment
router.post('/create-comment', protect, createComment);

// Get Comments by BlogId
router.get('/get-comments-byId/:blogId', getAllCommentsByBlogId);

// // Get Comments by BlogId
// router.get('/get-comments-byId', getAllCommentsByBlogId);

export default router;