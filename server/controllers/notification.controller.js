import Notification from "../models/Notification.model.js";


const newNotification = async (req, res, next) => {
    try {
        let { _id: userId } = req.user; // Destructuring user ID from request object
        const newNotification = await Notification.exists({notification_for: userId, seen: false, user: {$ne: userId}})

        if(newNotification){
            return res.status(200).json({
                new_notification_available: true,
                success: true
            })
        }else{
            return res.status(200).json({
                new_notification_available: false,
                success: true
            })
        }
    } catch (error) {
        next(error);
    }
}

const getNotifications = async (req, res, next) => {
    try {
        let { _id: userId } = req.user; // Destructuring user ID from request object
        let { page, filter, deletedDocument } = req.body;
        page = page ? parseInt(page) : 1;

        let maxLimit = 10;
        let findQuery = {notification_for: userId, user:{$ne: userId}};
        let skipDocs = (page - 1) * maxLimit;

        if(filter !== 'all'){
            findQuery.type = filter
        }

        if(deletedDocument){
            skipDocs -= deletedDocument;
        }

        const notifications = await Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("blogPost", "title slug author")
        .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .sort({createdAt: -1})
        .select("createdAt type seen reply") 

        const totalCount =   await Notification.countDocuments(findQuery);
        const totalPages = Math.ceil(totalCount/maxLimit);

        return res.status(200).json({
            success: true,
            data: notifications,
            currentPage: page,
            totalCount,
            totalPages,            
        })
    } catch (error) {
        return next(error);
    }
}

const allNotificationsCount = async (req, res, next) => {
    try {
        let { _id: userId } = req.user; // Destructuring user ID from request object
        let { filter } = req.body; 

        let findQuery = {notification_for: userId, user:{$ne: userId}};

        if(filter !== 'all'){
            findQuery.type = filter
        }

        const count =   await Notification.countDocuments(findQuery);
        return res.status(200).json({totalDocs: count})

    } catch (error) {
        return next(error);
    }
}

export {
    newNotification,
    getNotifications,
    allNotificationsCount
}