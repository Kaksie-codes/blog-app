import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
    newNotification, 
    getNotifications,
    allNotificationsCount,
    deleteNotification,
    notificationsSeen
} from "../controllers/notification.controller.js";

// Initialize the router
const router = Router();

router.get('/new-notification', protect, newNotification)
router.post('/get-notifications', protect, getNotifications)
router.post('/all-notifications-count', protect, allNotificationsCount)
router.post('/delete-notification', protect, deleteNotification)
router.post('/notifications-seen', protect, notificationsSeen)

export default router;