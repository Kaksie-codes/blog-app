import mongoose from "mongoose";

const { Schema } = mongoose; // Correct import

const blogPostSchema = new Schema({ // Use `new Schema` correctly
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        maxlength: 200,
        // required: true
    },
    content: {
        type: String,
        // required: true
    },
    tags: { 
        type: [String],
        // required: true 
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
        likes: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'User',
            default: [],
        }]
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    draft: {
        type: Boolean,
        default: false
    } 
}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
