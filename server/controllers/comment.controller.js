 import Comment from "../models/Comment.model.js"; 
 import User from "../models/user.model.js"
 import BlogPost from "../models/blogPost.model.js";
 import Notification from "../models/Notification.model.js";
 import handleError from "../utils/error.js";


 const createComment = async (req, res, next) => {
    try {
        // Get user ID from middleware
        let userId = req.user.id;

        // Extract data from request body
        let { blogId, comment, replying_to, blog_author, notificationId  } = req.body;

        // Check if the comment is empty
        if (!comment.length) {
            return next(handleError(403, 'Write something to leave a comment'));
        }

        // Find the associated blog post
        const blogPost = await BlogPost.findById(blogId);

        // Check if the blog post exists
        if (!blogPost) {
            return next(handleError(403, 'Blog Post does not exist'));
        }

        let parentComment;
        let parent_user_id; 
        let commentLevel = 0;

        // Set properties for a reply
        if (replying_to) {
            // Find the parent comment
            parentComment = await Comment.findById(replying_to);

            if (!parentComment) {
                return next(handleError(404, 'Parent comment not found'));
            }

            // Determine comment level based on parent comment's level
            commentLevel = parentComment.comment_level + 1;
            parent_user_id = parentComment.commented_by;

            // // Update notification with reply if notification ID is provided
            // if(notificationId){
            //     await Notification.findOneAndUpdate({_id: notificationId}, {reply: comment});
            //     console.log('notification updated');
            // }
        }

        // Construct new comment object
        let newCommentObj = {
            blog_id: blogId,
            blog_author,
            comment,
            commented_by: userId,
            isReply: !!replying_to, // Convert replying_to to boolean
            parent_comment_id: replying_to ? replying_to : null,
            parent_user_id: parent_user_id ? parent_user_id : null,
            comment_level: commentLevel, // Set the comment level
            children: [] // Initialize children array
        };

        // Create a new comment
        let newComment = new Comment(newCommentObj);

        // Check for duplicate child IDs before pushing
        if (replying_to && parentComment.children.includes(newComment._id)) {
            return next(handleError(400, 'Duplicate child ID detected'));
        }
     

        // Push new comment ID to parent's children array
        if (replying_to) {
            parentComment.children.push(newComment._id);
            await parentComment.save();

            console.log('replying_to: =====>>', replying_to);
            const rootCommentId = await findRootCommentId(replying_to);       
            if (rootCommentId.toString() !== replying_to) {
                const rootComment = await Comment.findById(rootCommentId);
                rootComment.children.push(newComment._id);
                await rootComment.save();
                console.log('Root Comment ID: =====>>', rootCommentId.toString());
            } else {
                console.log('Root Comment not found');
            }
        }

        // Save new comment
        const savedComment = await newComment.save();

        // Update the associated blog post
        blogPost.comments.push(savedComment._id);
        blogPost.activity.total_comments += 1;
        await blogPost.save();

        const newNotificationObj = {
            type: replying_to ? 'reply' : 'comment',
            blogPost: blogId,
            notification_for: blog_author,
            user: userId,
            comment: savedComment._id
        };

        // Create notification for reply
        if (replying_to) {
            newNotificationObj.replied_on_comment = replying_to;
            newNotificationObj.notification_for = parentComment.commented_by;
        }

        const newNotification = new Notification(newNotificationObj);
        await newNotification.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Successfully created a comment',
            comment: savedComment
        });
    } catch (error) {
        return next(error);
    }
};

const findRootCommentId = async (commentId) => {
    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    
    // If the parent comment exists and it has a parent comment ID, 
    // continue the recursive search for the root comment
    if (parentComment && parentComment.parent_comment_id) {
        return findRootCommentId(parentComment.parent_comment_id);
    }

    // If the parent comment exists but it doesn't have a parent comment ID,
    // it's the root comment, so return its ID
    if (parentComment) {
        return parentComment._id;
    }

    // If the parent comment doesn't exist, return null
    return null;
};

const deleteComment = async (req, res, next) => {
    try {
        // Get user ID from middleware
        let userId = req.user.id;

        let { commentId } = req.params;

        // Find the comment to delete 
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            return next(handleError(404, 'Comment not found'));            
        }

        // console.log('userId ====>', userId)
        // console.log('commentedBy ====>', comment.commented_by.toString())
        // console.log('blogAuthor ====>', comment.blog_author.toString())

        // Check if the user is authorized to delete the comment 
        if (comment.commented_by.toString() !== userId && comment.blog_author.toString() !== userId) {
            return next(handleError(403, 'Unauthorized to delete this comment'));
        }

        // Recursively delete descendants if the comment has children
        if (comment.children.length > 0) {
            await deleteDescendants(comment.children, userId);
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);        
        // await Notification.findOneAndDelete({comment: commentId})
        // await Notification.findOneAndDelete({user: userId})
        await Notification.findOneAndDelete({
            $or: [
                { comment: commentId },
                { user: userId }
            ]
        });        
        console.log('notification deleted');

        // Remove the commentId from the comments array in the corresponding BlogPost
        await BlogPost.findByIdAndUpdate(comment.blog_id, {
            $pull: { comments: commentId },
            $inc: { 'activity.total_comments': -1 }
        }, { new: true });
        
        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Comment and its descendants deleted successfully' 
        });
    } catch (error) {
        return next(error);
    }
};

const deleteDescendants = async (commentIds, userId) => {
    for (const commentId of commentIds) {
        const comment = await Comment.findById(commentId);
        if (comment) { // Check if comment exists
            if (comment.children.length > 0) {
                await deleteDescendants(comment.children);
            }
            await Comment.findByIdAndDelete(commentId);
            // await Notification.deleteMany({comment: commentId});
            // await Notification.deleteMany({user: userId});
            await Notification.deleteMany({
                $or: [
                    { comment: commentId },
                    { user: userId }
                ]
            });   
            console.log('notifications deleted');
        } else {
            console.log(`Comment with ID ${commentId} not found.`);
        }
    }
};

const getTotalCommentsCount = async (req, res, next) => {
    try{
        // Assuming blogId is passed as a parameter
        const { blogId } = req.params;

        // Fetch total number of comments in the database
        const totalCommentsCount = await Comment.countDocuments({ blog_id: blogId });
        
        return  res.status(200).json({
                total_comments: totalCommentsCount
        })

    }catch(error){
        return next(error);
    }
}

const getCommentsByBlogId = async (req, res, next) => {
    try {
        // Assuming blogId is passed as a parameter
        const { blogId } = req.params;

        // Get page number from query parameters
        const { page } = req.query;

        // Number of comments per page
        const maxLimit = 10;

        // Calculate skip value based on page number
        const skip = (page - 1) * maxLimit;

        // Fetch the BlogPost document and populate the comments array
        const blogPost = await BlogPost.findById(blogId);          

        if (!blogPost) {
            return next(handleError(404, 'Blog post not found'));
        }

        // const totalComments = blogPost.comments.length;

        // Fetch parent comments based on the blogPost comments array, filtering only parent comments
        const parentComments = await Comment.find({ _id: { $in: blogPost.comments }, isReply: false })
            .populate('blog_author', 'personal_info.username personal_info.profile_img _id')
            .populate('commented_by', 'personal_info.username personal_info.profile_img _id')
            .populate('parent_user_id', 'personal_info.username personal_info.profile_img _id')
            .skip(skip)
            .limit(maxLimit);

        const totalCommentsCount = blogPost.comments.length; // Total comments count

        // Calculate total pages
        const totalPages = Math.ceil(totalCommentsCount / maxLimit);

        // console.log('totalPages =====>>', totalPages)

        // Return the response
        return res.status(200).json({ 
            currentPage: Number(page),
            totalCount: totalCommentsCount,
            totalPages: totalPages,           
            comments: parentComments,
            // total_comments: totalComments            
        });
    } catch (error) {
        next(error);
    }
};
  
const getRepliesByParentId = async (req, res, next) => {
    try {
        const { parentCommentId } = req.params;  
        // console.log('parentKoment-ID', parentCommentId)      

        // Find the parent comment
        const parentComment = await Comment.findById(parentCommentId);

        // console.log('parentKoment', parentComment)   

        if (!parentComment) {
            return next(handleError(404, 'Parent comment not found'));   
        }

        // Fetch immediate children based on the children IDs and populate author details
        const childComments = await Comment.find({ _id: { $in: parentComment.children } })
                              .populate('blog_author', 'personal_info.username personal_info.profile_img _id')
                              .populate('commented_by', 'personal_info.username personal_info.profile_img _id')
                              .populate('parent_user_id', 'personal_info.username personal_info.profile_img _id');       

        // Return the replies (immediate children) in the response
        res.status(200).json({ 
            replies: childComments
        });
    } catch (error) { 
       return next(error);
    }
};

const getTotalRepliesCountByParentId = async (req, res, next) => {
    try {
        const { parentCommentId } = req.params;

        // Find the parent comment
        const parentComment = await Comment.findById(parentCommentId);

        if (!parentComment) {
            return next(handleError(404, 'Parent comment not found'));
            console.log('no access to comments')   
        } 
        
        // Get the total number of replies (children)
        const totalRepliesCount = parentComment.children.length;

        // Return the total number of replies in the response
        res.status(200).json({
            total_replies_count: totalRepliesCount
        });
    } catch (error) {
        return next(error);
    }
}

const editComment = async (req, res, next) => {
    try {
        // Get user ID from middleware
        let userId = req.user.id;

        // Extract data from request body
        let { commentId, editedComment } = req.body;

        // Check if the comment is empty
        if (!editedComment.length) {
            return next(handleError(403, 'Write something to edit a comment'));
        }

        const comment = await Comment.findByIdAndUpdate({_id:commentId}, {comment: editedComment });

        // Check if the comment is empty
        if (!comment) {
            return next(handleError(403, 'Comment not found'));
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully edited the comment'
        })

    } catch (error) {
        return next(error);
    }
}

const likeComment = async (req, res, next) => {     
    
    let userId = req.user.id;    
    let { commentId, comment_author, blogId } = req.body;  
    
    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return next(handleError(404, 'Comment not found'));
        }       

        // Check if the user has already liked the comment
        const userLiked = comment.activity.likes.includes(userId); 

        if (!userLiked) {
            // If the user has not liked the comment, add the like
            comment.activity.likes.push(userId);
            comment.activity.total_likes += 1;

            // Create notification for liking the comment
            const newNotificationObj = {
                type: 'like',
                blogPost: blogId, 
                notification_for: comment_author,
                user: userId,
                comment: comment._id
            };
            const newNotification = new Notification(newNotificationObj);
            await newNotification.save();
        } else {
            // If the user has already liked the comment, remove the like
            const index = comment.activity.likes.indexOf(userId);
            comment.activity.likes.splice(index, 1);
            comment.activity.total_likes -= 1;

            // Delete the notification for unliking the comment
            await Notification.findOneAndDelete({
                type: 'like',
                blogPost: blogId,
                notification_for: comment_author,
                user: userId,
                comment: comment._id
            });
        }

        await comment.save();

        return res.status(200).json({ 
            success: true, 
            message: "Like status toggled successfully", 
            data: {
                likesCount: comment.activity.total_likes, 
                likes: comment.activity.likes, 
            }            
        });   
    } catch (error) {
        console.error("Error liking comment:", error);
        return next(error);        
    }
};


 export{
    createComment,
    likeComment,
    editComment,
    getCommentsByBlogId,
    deleteComment,
    getRepliesByParentId,
    getTotalCommentsCount,
    getTotalRepliesCountByParentId
 }
