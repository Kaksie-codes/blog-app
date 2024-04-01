import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ["like", "comment", "reply"],
        required: true
    },
    blogPost: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BlogPost'
    },
    notification_for: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }, 
    replied_on_comment: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    seen: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;