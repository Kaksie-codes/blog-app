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
        let newCommentObj = {
            blog_id: blogId,
            blog_author,
            comment,
            commented_by: userId
        }

        if(replying_to){
            newCommentObj.parent = replying_to;
            newCommentObj.isReply = true;
        }


        let newComment = new Comment(newCommentObj)

        const savedComment = await newComment.save();

        const {comment: user_comment, commentedAt, children, _id: commentId} = savedComment;

                
        // Update the blog post with new comment information
        blogPost.comments.push(commentId);
        blogPost.activity.total_comments += 1;
        blogPost.activity.total_parent_comments += replying_to ? 0 : 1;
        await blogPost.save();

        const newNotificationObj = {
            type: replying_to ? "reply" : "comment",
            blogPost: blogId,
            notification_for: blog_author,
            user: userId,
            comment: commentId
        }

        if(replying_to){
            newNotificationObj.replied_on_comment = replying_to;

            // if you are replying to a comment, add the commentId as a child to the parent Comment
            const comment =  await Comment.findByIdAndUpdate({_id: replying_to}, {$push : { children: commentId}});
            // create a notification telling the owner of the commnt that someone replied to his comment
            newNotificationObj.notification_for = comment.commented_by;
        }

        const newNotification = new Notification(newNotificationObj);

        await newNotification.save()
    
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


// const getAllCommentsByBlogId = async (req, res, next) => {
//     try {
//         const { blogId } = req.params; // Assuming blogId is passed as a parameter
//         const { page } = req.query; // Get page number from query parameters
//         const pageSize = 6; // Number of comments per page

//         // Calculate skip value based on page number
//         const skip = (page - 1) * pageSize;

//         // Fetch all comments based on the blog_id
//         const comments = await Comment.find({ blog_id: blogId }).skip(skip)
//         .limit(pageSize);

//          // Fetch total number of comments in the database
//          const totalCommentsCount = await Comment.countDocuments({ blog_id: blogId });

//         // Array to hold comment details with user information
//         const commentsWithUserDetails = [];

//         // Iterate through each comment to fetch user details
//         for (const comment of comments) {
//             // Fetch user details based on commenter's ID
//             const user = await User.findById(comment.commented_by);

//             // Construct comment object with user details
//             const commentWithUser = {
//                 _id: comment._id,
//                 blog_id: comment.blog_id,
//                 blog_author: comment.blog_author,
//                 comment: comment.comment,
//                 commented_by: {
//                     _id: user._id,
//                     username: user.personal_info.username, // Assuming username is needed
//                     // Add other user details as needed
//                 },
//                 isReply: comment.isReply,
//                 parent: comment.parent,
//                 childrenLevel: 0,
//                 commentedAt: comment.commentedAt
//             };

//             commentsWithUserDetails.push(commentWithUser);
//         }

//         // Return comments along with total number of comments
//         res.status(200).json({
//             total_comments: totalCommentsCount,
//             comments: commentsWithUserDetails
//         });
//     } catch (error) {
//         return next(error)
//     }
// };

const getAllCommentsByBlogId = async (req, res, next) => {
    try {
        const { blogId } = req.params; // Assuming blogId is passed as a parameter

        // Fetch all parent comments based on the blog_id and isReply property
        const parentComments = await Comment.find({ blog_id: blogId, isReply: false });

        // Array to hold comment details with user information
        const commentsWithChildren = [];

        // Iterate through each parent comment
        for (const parentComment of parentComments) {
            // Fetch user details based on commenter's ID
            const user = await User.findById(parentComment.commented_by);

            // Construct parent comment object with user details
            const parentCommentWithUser = {
                _id: parentComment._id,
                blog_id: parentComment.blog_id,
                blog_author: parentComment.blog_author,
                comment: parentComment.comment,
                commented_by: {
                    _id: user._id,
                    username: user.personal_info.username, // Assuming username is needed
                    // Add other user details as needed
                },
                isReply: parentComment.isReply,
                parent: parentComment.parent,
                childrenLevel: 0,
                commentedAt: parentComment.commentedAt
            };

            // Fetch child comments for the parent comment
            const childComments = await getChildrenComments(parentComment._id);

            // Recursively fetch and append child comments' children
            const parentWithChildren = await appendChildren(parentCommentWithUser, childComments);

            // Add the parent comment with its children to the final array
            commentsWithChildren.push(parentWithChildren);
        }

        // Return comments with children
        res.status(200).json({
            total_comments: parentComments.length,
            comments: commentsWithChildren
        });
    } catch (error) {
        return next(error);
    }
};

// Function to fetch children comments recursively
const getChildrenComments = async (parentId) => {
    const childComments = await Comment.find({ parent: parentId });

    // Array to hold all children comments
    const allChildren = [];

    // Iterate through each child comment
    for (const childComment of childComments) {
        // Fetch user details based on commenter's ID
        const user = await User.findById(childComment.commented_by);

        // Construct child comment object with user details
        const childCommentWithUser = {
            _id: childComment._id,
            blog_id: childComment.blog_id,
            blog_author: childComment.blog_author,
            comment: childComment.comment,
            commented_by: {
                _id: user._id,
                username: user.personal_info.username, // Assuming username is needed
                // Add other user details as needed
            },
            isReply: childComment.isReply,
            parent: childComment.parent,
            childrenLevel: 0,
            commentedAt: childComment.commentedAt
        };

        // Recursively fetch and append child comments' children
        const childWithChildren = await appendChildren(childCommentWithUser, childComments);

        // Add the child comment with its children to the array
        allChildren.push(childWithChildren);
    }

    return allChildren;
};

// Function to recursively append children to the comment object
const appendChildren = async (comment, allComments) => {
    const children = allComments.filter(child => child.parent.toString() === comment._id.toString());

    // If there are children comments, append them to the comment object
    if (children.length > 0) {
        comment.childrenComments = [];
        for (const child of children) {
            const childWithChildren = await appendChildren(child, allComments);
            comment.childrenComments.push(childWithChildren);
        }
    }

    return comment;
};



 export{
    createComment,
    getAllCommentsByBlogId
 }