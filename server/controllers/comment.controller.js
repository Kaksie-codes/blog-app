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
        let { blogId, comment, replying_to, blog_author } = req.body;

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
        let parent_user_id = null
        let commentLevel = 0;

        // Set properties for a reply
        if (replying_to) {
            // Find the parent comment
            parentComment = await Comment.findById(replying_to);
            parent_user_id = parentComment.commented_by;
           
            if (!parentComment) {
                return next(handleError(404, 'Parent comment not found'));
            }

            // Determine comment level based on parent comment's level
            commentLevel = parentComment.comment_level + 1;
        }

        // Construct new comment object
        let newCommentObj = {
            blog_id: blogId,
            blog_author,
            comment,
            commented_by: userId,
            isReply: !!replying_to, // Convert replying_to to boolean
            parent_comment_id: replying_to,
            parent_user_id,            
            comment_level: commentLevel // Set the comment level
        };

        // Create a new comment
        let newComment = new Comment(newCommentObj);
        const savedComment = await newComment.save();
        const { comment: user_comment, commentedAt, children, _id: commentId } = savedComment;

        // If replying to a comment, update parent comment's childrenComments array
        if (replying_to) {
            parentComment.children.push(savedComment._id);
            await parentComment.save();
        }

        // Update the associated blog post
        blogPost.comments.push(savedComment._id);
        await blogPost.save();

        const newNotificationObj = {
            type: replying_to ? 'reply' : 'comment',
            blogPost: blogId,
            notification_for: blog_author,
            user: userId,
            comment: commentId
        };

        if (replying_to) {
            newNotificationObj.replied_on_comment = replying_to;

            // if you are replying to a comment, add the commentId as a child to the parent Comment
            const comment = await Comment.findByIdAndUpdate(
                { _id: replying_to },
                { $push: { children: commentId } }
            );
            // create a notification telling the owner of the comment that someone replied to his comment
            newNotificationObj.notification_for = comment.commented_by;
        }

        const newNotification = new Notification(newNotificationObj);
        await newNotification.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Successfully created a comment',
            data: {
                comment: user_comment,
                commentedAt,
                commentId,
                userId,
                children
            }
        });
    } catch (error) {
        return next(error);
    }
};



const getAllCommentsByBlogId = async (req, res, next) => {
    try {
        const { blogId } = req.params; // Assuming blogId is passed as a parameter

        const { page } = req.query; // Get page number from query parameters
        const pageSize = 6; // Number of comments per page

        // Calculate skip value based on page number
        const skip = (page - 1) * pageSize;        

        // Fetch all parent comments based on the blog_id and isReply property
        const parentComments = await Comment.find({ blog_id: blogId, isReply: false }).skip(skip)
            .limit(pageSize);

        // Fetch total number of comments in the database
        const totalCommentsCount = await Comment.countDocuments({ blog_id: blogId });

        // Array to hold comment details with user information
        const commentsWithChildren = [];

        // Iterate through each parent comment
        for (const parentComment of parentComments) {
            
            // Fetch blog author details
            const blogAuthor = await User.findById(parentComment.blog_author);

            // Fetch user details of the commenter
            const user = await User.findById(parentComment.commented_by);

            // Construct parent comment object with user details
            const parentCommentWithUser = {
                _id: parentComment._id,
                blog_id: parentComment.blog_id,
                blog_author: {
                    _id: blogAuthor._id,
                    username: blogAuthor.personal_info.username,
                    // Include other relevant blog author details here
                },
                comment: parentComment.comment,
                comment_level: parentComment.comment_level,
                commented_by: {
                    _id: parentComment.commented_by,
                    username: user.personal_info.username
                },
                isReply: parentComment.isReply,
                parent_comment_id: parentComment.parent_comment_id,
                commentedAt: parentComment.commentedAt
            };


            // Fetch all descendants (children, grandchildren, etc.) for the parent comment
            const descendants = await getAllDescendants(parentComment._id);

            // Add the parent comment with its descendants to the final array
            parentCommentWithUser.childrenComments = descendants;
            commentsWithChildren.push(parentCommentWithUser);
        }

        // Return comments with children
        res.status(200).json({
            total_comments: totalCommentsCount,
            comments: commentsWithChildren
        });
    } catch (error) {
        return next(error);
    }
};


const getAllDescendants = async (parentId) => {
    // Sort in ascending order based on createdAt timestamp
    const childComments = await Comment.find({ parent_comment_id: parentId }).sort({ createdAt: 1 });

    // Array to hold all descendants (children, grandchildren, etc.)
    const descendants = [];

    // Iterate through each child comment
    for (const childComment of childComments) {  

        // Fetch blog author details
        const blogAuthor = await User.findById(childComment.blog_author);

        // Fetch the user details of the commenter
        const user = await User.findById(childComment.commented_by);

        // Fetch the user details of the parent commenter
        const parentReply = await User.findById(childComment.parent_user_id);

        // Construct child comment object with user details
        const childCommentWithUser = {
            _id: childComment._id,
            blog_id: childComment.blog_id,
            blog_author: {
                _id: blogAuthor._id,
                username: blogAuthor.personal_info.username,
                // Include other relevant blog author details here
            },
            comment: childComment.comment,
            comment_level: childComment.comment_level,
            commented_by: {
                _id: childComment.commented_by,
                username: user.personal_info.username
            },        
            isReply: childComment.isReply,
            parent_comment_id: childComment.parent_comment_id, 
            parent_reply: {
                _id: childComment.parent_user_id,
                username: parentReply ? parentReply.personal_info.username : null // Handle if parentReply is null
            },
            commentedAt: childComment.commentedAt
        };

        // Recursively fetch all descendants of the child comment
        const childDescendants = await getAllDescendants(childComment._id);

        // Add the child comment with its descendants to the array
        childCommentWithUser.childrenComments = childDescendants;
        descendants.push(childCommentWithUser);
    }

    return descendants;
};





 export{
    createComment,
    getAllCommentsByBlogId
 }
