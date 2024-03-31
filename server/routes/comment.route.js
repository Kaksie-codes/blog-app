 import { Router } from "express";
 import { verifyToken } from "../middleware/auth.middleware.js";
 import { createComment } from "../controllers/comment.controller.js";

// Initialize the router
const router = Router();

// Create a Comment
router.post('/create', verifyToken, createComment);

export default router;