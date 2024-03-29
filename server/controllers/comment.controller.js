 import Comment from "../models/Comment.model.js"; 
 import BlogPost from "../models/blogPost.model.js";
 import Notification from "../models/Notification.model.js";
 import handleError from "../utils/error.js";

 const createComment = async (req, res, next) => {    
    try{
        let user_id = req.user.id;
        let { blog_id, comment:user_comment, blog_author } = req.body;

        // // check if the user is authenticated
        // if(userId != user_id){
        //     return next(handleError(403, 'You are not allowed to create this comment'))
        // }

        // check if User provided a comment
        if(!user_comment.length){
            return next(handleError(403, 'Write Something to leave a comment'))
        }

        // create a new comment 
        const newComment = new Comment({
            blog_id,
            blog_author,
            comment: user_comment,
            commented_by: user_id
        })

        // save the new comment in the comment collection
        await newComment.save();

        let { _id:comment_id, comment, commentedAt, children } = newComment;

        // find the blogPost which has that id, and update it accordingly
        const updatedBlog = await BlogPost.findOneAndUpdate({blog_id},  { $push: {"comments": comment_id}, $inc: {"activity.total_comments": 1}, "activity.total_parents_comments": 1})

        const newNotification = new Notification({
            type: "comment",
            blogPost: blog_id,
            notification_for: blog_author,
            user: user_id,
            comment: comment_id,
            updatedBlog
        })

        await newNotification.save()

        console.log('new comment', newComment);
        return  res.status(200).json({ comment, commentedAt, _id:comment_id, user_id, children})
    }catch(err){
        return next(err);
    }
 }

 export{
    createComment,
 }