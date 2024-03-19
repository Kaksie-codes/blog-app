import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users', // Assuming the author of the blog is a user
    },
    comment: {
        type: String,
        required: true
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    commented_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
        default: false // Assuming it defaults to false if not explicitly provided
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }
},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
});

export default mongoose.model("comments", commentSchema);
