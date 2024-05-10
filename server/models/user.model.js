import mongoose from "mongoose";

const { Schema } = mongoose;

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = new Schema({
    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: false,
            // minlength: [3, 'fullname must be 3 letters long'],
        },
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
            required:true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: String,       
        bio: {
            type: String,
            maxlength: [150, 'Bio should not be more than 150 words'],
            default: "",
        },
        profile_img: {
            type: String,
            default: '',
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            } 
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false 
    },
    role:{
        type: String,
        enum:['user', 'admin'],
        default: 'user'
    },
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'BlogPost',
        default: [],
    }]
}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 
});


const User = mongoose.model('User', userSchema);
export default User;