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
        let { blogId, comment, replying_to, blog_author  } = req.body;

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

        // let repliedComment
        // let parent_user_id

        // if(replying_to){
        //     repliedComment =  await Comment.findById(replying_to); 
            
        // }


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
            parent_user_id = parentComment.commented_by
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
        }

        // Save new comment
        const savedComment = await newComment.save();

        // Update the associated blog post
        blogPost.comments.push(savedComment._id);
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

        // Check if the user is authorized to delete the comment 
        if (comment.commented_by && comment.blog_author &&
            comment.commented_by.toString() !== userId &&
            comment.blog_author.toString() !== userId) {
            return next(handleError(403, 'Unauthorized to delete this comment'));
        }

        // Recursively delete descendants if the comment has children
        if (comment.children.length > 0) {
            await deleteDescendants(comment.children);
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Comment and its descendants deleted successfully' 
        });
    } catch (error) {
        return next(error);
    }
};

const deleteDescendants = async (commentIds) => {
    for (const commentId of commentIds) {
        const comment = await Comment.findById(commentId);
        if (comment) { // Check if comment exists
            if (comment.children.length > 0) {
                await deleteDescendants(comment.children);
            }
            await Comment.findByIdAndDelete(commentId);
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


const getDescendantCommentsCount = async (commentId) => {
    let count = 0;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return 0;
    }
    // Recursively count the descendants of each child comment
    for (const childId of comment.children) {
        count++; // Increment count for the current child comment
        count += await getDescendantCommentsCount(childId); // Recursively count descendants
    }
    return count;
};



const getCommentsByBlogId = async (req, res, next) => {
    try {
        // Assuming blogId is passed as a parameter
        const { blogId } = req.params;

        // Get page number from query parameters
        const { page } = req.query;

        // Number of comments per page
        const pageSize = 6;

        // Calculate skip value based on page number
        const skip = (page - 1) * pageSize;  

        // Fetch total number of comments in the database
        const totalCommentsCount = await Comment.countDocuments({ blog_id: blogId });

        // Array to hold comment details with user information
        const comments = [];
        let descendantCommentsCount;


        const parentComments = await Comment.find({ blog_id: blogId, isReply: false })
        .skip(skip)
        .limit(pageSize)
        // .populate({
        //     path: 'blog_author commented_by parent_user_id',
        //     select: 'personal_info.username personal_info.profile_img'
        // })
        .sort({ commentedAt: -1 }); // Sort in descending order based on creation time

        // Iterate through each parent comment
        for (const parentComment of parentComments) {
            // Fetch blog author details
            const blogAuthor = await User.findById(parentComment.blog_author);

            // Fetch user details of the commenter
            const user = await User.findById(parentComment.commented_by);

            // Count descendant comments for each parent comment
            descendantCommentsCount = await getDescendantCommentsCount(parentComment._id);

            const commentData = {
                _id: parentComment._id,
                blog_id: parentComment.blog_id,
                blog_author: {
                    _id: blogAuthor._id,
                    username: blogAuthor.personal_info.username,
                    profile_img: blogAuthor.personal_info.profile_img
                    // Include other relevant blog author details here
                },
                activity:{
                    total_likes: parentComment.activity.total_likes,
                    likes: parentComment.activity.likes
                },
                comment: parentComment.comment,
                comment_level: parentComment.comment_level,
                commented_by: {
                    _id: parentComment.commented_by,
                    username: user.personal_info.username,
                    profile_img: user.personal_info.profile_img
                },
                isReply: parentComment.isReply,
                parent_user: parentComment.parent_user_id,
                commentedAt: parentComment.commentedAt,
                children: parentComment.children,                
            }    
            
            comments.push(commentData)
        }

    return  res.status(200).json({
                total_comments: totalCommentsCount,
                parent_comments: comments.length,
                children: descendantCommentsCount,
                comments
                // parent_comments: parentComments.length,
                // comments: parentComments                
            });
    } catch (error) {
        next(error);
    }
};

const getRepliesByParentId = async (req, res, next) => {
    try {
        const { parentCommentId } = req.params;

        // Check if the comment exists in the database
        const comment = await Comment.findById(parentCommentId);

        if (!comment) {
            return next(handleError(404, 'Comment not found'));   
        }

        let processedChildren = [];
        const replies = [];

        const fetchDescendants = async (comments) => {
            for (const child of comments) {
                const comment = await Comment.findById(child._id)
                // .populate({
                //     path: 'blog_author commented_by parent_user_id', // Include parent_user_id here
                //     select: 'personal_info.username personal_info.profile_img'
                // })
                .sort({ commentedAt: -1 });

                // Fetch blog author details
                const blogAuthor = await User.findById(comment.blog_author);

                // Fetch user details of the commenter
                const user = await User.findById(comment.commented_by);

                // Fetch user details of the commenter
                const parent_commenter = await User.findById(comment.parent_user_id);

                // console.log('parent_commenter >>>', parent_commenter)

                const childComment = {
                    _id: comment._id,
                    blog_id: comment.blog_id,
                    blog_author: {
                        _id: blogAuthor._id,
                        username: blogAuthor.personal_info.username,
                        profile_img: blogAuthor.personal_info.profile_img
                        // Include other relevant blog author details here
                    },
                    activity:{
                        total_likes: comment.activity.total_likes,
                        likes: comment.activity.likes
                    },
                    comment: comment.comment,
                    comment_level: comment.comment_level,
                    commented_by: {
                        _id: comment.commented_by,
                        username: user.personal_info.username,
                        profile_img: user.personal_info.profile_img
                    },
                    isReply: comment.isReply,                    
                    parent_user: {
                        _id: parent_commenter ?  comment.parent_user_id : null,
                        username: parent_commenter ?  parent_commenter.personal_info.username : null,
                        profile_img: parent_commenter ?  parent_commenter.personal_info.profile_img : null
                    },
                    commentedAt: comment.commentedAt
                }


                if (childComment) {
                    processedChildren.push(childComment);
                    if (comment.children.length > 0) {
                        await fetchDescendants(comment.children);
                    }
                }
            }
        };

        await fetchDescendants(comment.children);

        // Return the replies (descendants) in the response
        res.status(200).json({
            replies_count: processedChildren.length,
            replies: processedChildren
        });
    } catch (error) {
        next(error);
    }
};








 export{
    createComment,
    getCommentsByBlogId,
    deleteComment,
    getRepliesByParentId,
    getTotalCommentsCount
 }
