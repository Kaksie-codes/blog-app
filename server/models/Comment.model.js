import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BlogPost'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming the author of the blog is a user
    },
    comment: {
        type: String,
        required: true
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commented_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false // Assuming it defaults to false if not explicitly provided
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
