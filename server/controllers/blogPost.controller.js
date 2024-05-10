import BlogPost from '../models/blogPost.model.js'
import User from '../models/user.model.js'
import Comment from '../models/Comment.model.js'
import Notification from '../models/Notification.model.js';
import handleError from '../utils/error.js';
import generateSlug from '../utils/generateSlug.js';


const createBlog = async (req, res, next) => {
    
    let authorId = req.user.id;
    // let authorId = req.user;
    let { title, description, banner, tags, content, draft, slug } = req.body;

    if (authorId) {
        // res.status(200).json({ success: true, message: 'Blog post created successfully', data: req.user.id });
        if(!title.length){
            next(handleError(403, 'You must provide a title'))
        }
        if(!draft){            
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
        }       

        // Convert all tags to lowercase
        let lowerCaseTags = tags.map(tags => tags.toLowerCase()); 

        // If a blog_id already exist store it inside blogId else generate a new Id
        let blog_slug = slug || generateSlug(title);              
        
        try {  
             
            if(slug){
            // Logic to update the blog post if te id already exists
                const updatedBlogPost = await BlogPost.findOneAndUpdate({slug:blog_slug}, { title, description, banner, content, tags, draft: draft ? draft : false});

                res.status(200).json({ success: true, message: 'Blog post updated successfully', data: blog_slug });
            }else{
            // Logic to create the blog post            
            const newBlogPost = new BlogPost({
                ...req.body,
                tags: lowerCaseTags,                
                slug: blog_slug,
                author: authorId,
                draft: Boolean(draft)
              });
              
            const savedPost = await newBlogPost.save();
            let incrementVal = draft ? 0 : 1;

            await User.findOneAndUpdate({_id: authorId}, { $inc: {"account_info.total_posts": incrementVal}, $push: { 'blogPosts' : savedPost._id }})
            
            res.status(200).json({ success: true, message: 'Blog post created successfully', data: savedPost });
            }
            
        } catch (error) {
            // Handle any error that occurred during blog post creation
            return next(error);
        }
    } else {
        // Invalid token or token missing, respond with an error
        res.status(401).json({ success: false, message: 'Unauthorized. Invalid or missing token.' });
    }
};

const likeBlogPost = async (req, res, next) => {    
    
    let userId = req.user.id;    
    let { blogId:blogPostId, blog_author } = req.body
    
    try {
    //    const likedBlogPost = await  BlogPost.findOneAndUpdate({blogPostId}, {$inc: {"activity.total_likes": incrementval}});
        const blogPost = await BlogPost.findById(blogPostId);

        if (!blogPost) {
            return next(handleError(404, 'BlogPost not found'))
        }       

        // Check if the user has already liked the post
        const userLiked = blogPost.activity.likes.includes(userId);

        if (!userLiked) {
            // If the user has not liked the post, add the like
            blogPost.activity.likes.push(userId);
            blogPost.activity.total_likes += 1;

            // Create notification for liking the comment
            const newNotificationObj = {
                type: 'like',
                blogPost: blogPostId, 
                notification_for: blog_author,
                user: userId,                
            };
            const newNotification = new Notification(newNotificationObj);
            await newNotification.save();
        } else {
            // If the user has already liked the post, remove the like
            const index = blogPost.activity.likes.indexOf(userId);
            blogPost.activity.likes.splice(index, 1);
            blogPost.activity.total_likes -= 1;

            // Delete the notification for unliking the comment
            await Notification.findOneAndDelete({
                type: 'like',
                blogPost: blogPostId,
                notification_for: blog_author,
                user: userId,                
            });
        }

        await blogPost.save();

        return res.status(200).json({ 
            success: true, 
            message: "Like Status toggled successfully", 
            data: {
                likesCount: blogPost.activity.total_likes, 
                likes: blogPost.activity.likes, 
            }            
        });   
    } catch (error) {
        console.error("Error liking post:", error);
        return next(error);        
    }
};

const getLatestBlogPosts = async (req, res, next) => { 
    try{
        let maxLimit = 10;
        let { page } = req.body;
        page = page ? parseInt(page) : 1;

        const totalBlogs = await BlogPost.countDocuments({ draft: false });
        const totalPages = Math.ceil(totalBlogs / maxLimit);

        const latestBlogPosts = await BlogPost.find({ draft: false})
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({"publishedAt": -1})
        .select("slug title description banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
        
        res.status(200).json({ 
            success: true, 
            message: 'latest Blogs', 
            data: latestBlogPosts,
            currentPage:page,
            totalBlogs: totalBlogs,
            totalPages: totalPages  
        });
    }catch(error){
        return next(error);
    }    
}

const getTrendingBlogs = async (req, res, next) => {
    try{
        const trendingBlogPosts = await BlogPost.find({ draft: false})
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({"activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1})
        .select("slug title publishedAt -_id")
        .limit(5);
        res.status(200).json({ success: true, message: 'trending Blogs', data: trendingBlogPosts});
    }catch(error){
        return next(error);
    }
}

const searchBlogPosts = async (req, res, next) => {     
    try{
        let { tag, query, page, authorId, limit, eliminate_blog } = req.body;
        let maxLimit = limit ? limit : 10;        
        page = page ? parseInt(page) : 1;

        let searchQuery
        if(tag){
            // console.log('tag', tag)
            searchQuery = { tags:tag, draft:false, slug:{ $ne: eliminate_blog} };  
        }else if(query){
            searchQuery = { title: new RegExp(query, 'i'), draft:false };  
        }else if(authorId){
            searchQuery = { author: authorId, draft:false };             
        }
        
       

       const searchedBlogs = await BlogPost.find(searchQuery)
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
      .sort({"publishedAt": -1})
      .select("slug blog_id title description banner activity tags publishedAt -_id")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);
      
      const totalBlogs = await BlogPost.find(searchQuery);
      const totalPages = Math.ceil(totalBlogs.length / maxLimit);

       res.status(200).json({ 
            success: true, 
            message: `Search result for ${tag ? tag : query}`, 
            data: searchedBlogs,
            currentPage:page,
            totalCount: totalBlogs.length,
            totalPages: totalPages   
        });
    }catch(error){
        return next(error);
    }
}

const getBlogPost = async (req, res, next) => {     
    try{
        const { slug, draft, mode } = req.body;
        let incrementVal = mode != 'edit' ? 1 : 0;

        // Find the blog post by slug and update the total_reads count
        const blogPost =  await BlogPost.findOneAndUpdate({ slug }, {$inc: {"activity.total_reads": incrementVal}})
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname _id")
        .select("title description content banner activity publishedAt slug tags comments")

        // Update the total_reads count for the author
        await User.findOneAndUpdate({"personal_info.username": blogPost.author.personal_info.username}, {
            $inc: {"account_info.total_reads": incrementVal}
        })

        if (!blogPost) {
            return next(handleError(404, 'Blog post not found'));
        }

        // Populate the comments with the actual comment objects
         // Fetch comments separately
         const comments = await Comment.find({ blog_id: blogPost._id })
         .populate('commented_by', 'personal_info.username');

        
        if(blogPost.draft && !draft){
            next(handleError(500, 'You cannot access draft blogPosts'))
        }

        return res.status(200).json({status: "success", blogPost})
    }catch(error){
        return next(error);
    }
}

const getAllTags = async (req, res, next) => {
    try {
      // Fetch all blog posts
      const blogPosts = await BlogPost.find();
  
      // Create an empty array to store all tags
      let allTags = [];
  
      // Loop through each blog post
      blogPosts.forEach((post) => {
        // Concatenate tags of each blog post to allTags array
        allTags = allTags.concat(post.tags.map(tag => tag.toLowerCase()));
      });
   
      // Remove duplicate tags
      const uniqueTags = [...new Set(allTags)];
  
      // Send the unique tags as response 
      return res.status(200).json({ 
        success: true,
        message: 'successfully fetched all tags',
        tags: uniqueTags 
    });
    } catch (error) {
      // If there's an error, send error response
      return next(error);      
    }
};
  
const myBlogs = async (req, res, next) => {
    try {
        let { _id: userId } = req.user; // Destructuring user ID from request object
        let { page, draft, query, deletedDocCount } = req.body;

        let maxLimit = 5;        
        page = page ? parseInt(page) : 1;
        let skipDocs = (page -1) * maxLimit;

        if(deletedDocCount){
            skipDocs -= deletedDocCount;
        }

        const myBlogs = await BlogPost.find({author: userId, draft, title: new RegExp(query, 'i')})
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({publishedAt: -1})
        .select('title banner publishedAt slug activity des draft -_id')

        const totalCount =   myBlogs.length;
        const totalPages = Math.ceil(totalCount/maxLimit);

        if(!myBlogs.length){
            return next(handleError(400, 'You have no blog posts'));
        }

        return res.status(200).json({
            success:true,
            data: myBlogs,
            currentPage: page,
            totalCount,
            totalPages,
            message: 'Your blogs found'
        })

    } catch (error) {
        return next(error);
    }
}

const deleteBlog = async (req, res, next) => { 
    try {
        let { _id: userId } = req.user; // Destructuring user ID from request object
        let { slug } = req.body;

        const deletedBlogPost =  await BlogPost.findOneAndDelete({ slug });

        await Notification.deleteMany({blogPost: deletedBlogPost._id});
        console.log('notifications deleted');

        await Comment.deleteMany({blog_id: deletedBlogPost._id});
        console.log('comments deleted');

        User.findOneAndUpdate({_id: userId}, {$pull: {blogPosts: deletedBlogPost._id}, $inc: {"account_info.total_posts": -1}})
        console.log('Blog deleted');

        return res.status(200).json({
            success:true,
            message: 'BlogPost deleted'
        })

    } catch (error) {
        return next(error);
    }
}

export {  
    createBlog, 
    getLatestBlogPosts,
    getTrendingBlogs,
    searchBlogPosts,
    getBlogPost,
    likeBlogPost,   
    getAllTags,    
    myBlogs,
    deleteBlog 
} 