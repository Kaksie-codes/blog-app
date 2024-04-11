 import Comment from "../models/Comment.model.js"; 
 import User from "../models/user.model.js"
 import BlogPost from "../models/blogPost.model.js";
 import Notification from "../models/Notification.model.js";
 import handleError from "../utils/error.js";

 const createComment = async (req, res, next) => {
    try {
        let userId = req.user.id;        
        let { blogId, comment, replying_to, blog_author } = req.body;
 
        if(!comment.length){
            return next(handleError(403, 'Write something to leave a comment'))
        }

        const blogPost = await BlogPost.findById(blogId);

        if(!blogPost){
            return next(handleError(403, 'Blog Post does not exist'))
        }

        // Creating a new comment doc
        let newComment = new Comment({
            blog_id: blogId,
            blog_author,
            comment,
            commented_by: userId
        })

        const savedComment = await newComment.save();

        const {comment: user_comment, commentedAt, children, _id: commentId} = savedComment;

                
        // Update the blog post with new comment information
        blogPost.comments.push(commentId);
        blogPost.activity.total_comments += 1;
        blogPost.activity.total_parent_comments += 1;
        await blogPost.save();


        const newNotification = new Notification({
            type: "comment",
            blogPost: blogId,
            notification_for: blog_author,
            user: userId,
            comment: commentId
        })

        const savedNotification = await newNotification.save()
    
        return res.status(200).json({
            success: true,
            message: 'Successfully created a comment',
            data:{
                comment: user_comment,
                commentedAt,
                commentId,
                userId,
                children,
            }  
        })
        
    }catch(error){
        return next(error);
    }
}


const getAllCommentsByBlogId = async (req, res, next) => {
    try {
        const { blogId } = req.params; // Assuming blogId is passed as a parameter
        console.log('blogId >>>', blogId)

        // Fetch all comments based on the blog_id
        const comments = await Comment.find({ blog_id: blogId });

        // Array to hold comment details with user information
        const commentsWithUserDetails = [];

        // Iterate through each comment to fetch user details
        for (const comment of comments) {
            // Fetch user details based on commenter's ID
            const user = await User.findById(comment.commented_by);

            // Construct comment object with user details
            const commentWithUser = {
                _id: comment._id,
                blog_id: comment.blog_id,
                blog_author: comment.blog_author,
                comment: comment.comment,
                commented_by: {
                    _id: user._id,
                    username: user.personal_info.username, // Assuming username is needed
                    // Add other user details as needed
                },
                isReply: comment.isReply,
                parent: comment.parent,
                childrenLevel: 0,
                commentedAt: comment.commentedAt
            };

            commentsWithUserDetails.push(commentWithUser);
        }

        // Return comments along with total number of comments
        res.status(200).json({
            total_comments: comments.length,
            comments: commentsWithUserDetails
        });
    } catch (error) {
        return next(error)
    }
};



 export{
    createComment,
    getAllCommentsByBlogId
 }