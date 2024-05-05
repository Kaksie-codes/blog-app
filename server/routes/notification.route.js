import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
    newNotification, 
    getNotifications,
    allNotificationsCount
} from "../controllers/notification.controller.js";

// Initialize the router
const router = Router();

router.get('/new-notification', protect, newNotification)
router.post('/get-notifications', protect, getNotifications)
router.post('/all-notifications-count', protect, allNotificationsCount)

export default router;