 import { Router } from "express";
 import { verifyToken } from "../middleware/verifyToken.js";
 import { createComment } from "../controllers/comment.controller.js";

// Initialize the router
const router = Router();

// Create a Comment
router.post('/create', verifyToken, createComment);

export default router;