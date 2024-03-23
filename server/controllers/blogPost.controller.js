import BlogPost from '../models/blogPost.model.js'
import User from '../models/user.model.js'
import handleError from '../utils/error.js';
import generateSlug from '../utils/generateSlug.js';
import { nanoid } from 'nanoid'

const createBlog = async (req, res, next) => {
    
    let authorId = req.user.id;
    // let authorId = req.user;
    let { title, description, banner, tags, content, draft } = req.body;

    if (authorId) {
        // res.status(200).json({ success: true, message: 'Blog post created successfully', data: req.user.id });
        if(!title.length){
            next(handleError(403, 'You must provide a title'))
        }
        if(!banner.length){
            next(handleError(403, 'You must provide a title'))
        }
        if(!content.length){
            next(handleError(403, 'You must provide a blog content'))
        }
        if(!tags.length || tags.length > 10){
            next(handleError(403, 'Provide a maximum of 10 tags to publish post'))
        }
        if(!description.length || description.length > 200){
            next(handleError(403, 'You must provide a a blog description under 200 characters'))
        }

        // Convert all tags to lowercase
        let lowerCaseTags = tags.map(tags => tags.toLowerCase()); 

        let blogId = generateSlug(title);
        blogId += nanoid();        
        
        try {            
            // Logic to create the blog post            
            const newBlogPost = new BlogPost({
                ...req.body,
                tags: lowerCaseTags,                
                blog_id: blogId,
                author: authorId,
                draft: Boolean(draft)
              });
              
            const savedPost = await newBlogPost.save();
            let incrementVal = draft ? 0 : 1;

            await User.findOneAndUpdate({_id: authorId}, { $inc: {"account_info.total_posts": incrementVal}, $push: { 'blogPosts' : savedPost._id }})
            
            res.status(200).json({ success: true, message: 'Blog post created successfully', data: blogId });
        } catch (error) {
            // Handle any error that occurred during blog post creation
            return next(error);
        }
    } else {
        // Invalid token or token missing, respond with an error
        res.status(401).json({ success: false, message: 'Unauthorized. Invalid or missing token.' });
    }
};

export { createBlog }