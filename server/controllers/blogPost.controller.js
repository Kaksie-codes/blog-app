import BlogPost from '../models/blogPost.model.js'
import User from '../models/user.model.js'
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
    let { _id:blogPostId } = req.body
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
        } else {
            // If the user has already liked the post, remove the like
            const index = blogPost.activity.likes.indexOf(userId);
            blogPost.activity.likes.splice(index, 1);
            blogPost.activity.total_likes -= 1;
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
        let maxLimit = 5;
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
        let maxLimit = limit ? limit : 5;        
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
        
       const totalBlogs = await BlogPost.countDocuments({ draft: false });
       const totalPages = Math.ceil(totalBlogs / maxLimit);

       const searchedBlogs = await BlogPost.find(searchQuery)
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
      .sort({"publishedAt": -1})
      .select("blog_id title description banner activity tags publishedAt -_id")
      .limit(maxLimit);

       res.status(200).json({ 
            success: true, 
            message: `Search result for ${tag ? tag : query}`, 
            data: searchedBlogs,
            currentPage:page,
            totalBlogs: totalBlogs,
            totalPages: totalPages  
        });
    }catch(error){
        return next(error);
    }
}

const getBlogPost = async (req, res, next) => {     
    try{
        const { slug, draft, mode } = req.body;
        let incrementVal = mode != 'edit' ? 1 : 0
        const blogPost =  await BlogPost.findOneAndUpdate({ slug }, {$inc: {"activity.total_reads": incrementVal}})
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname _id")
        .select("title description content banner activity publishedAt slug tags")

        await User.findOneAndUpdate({"personal_info.username": blogPost.author.personal_info.username}, {
            $inc: {"account_info.total_reads": incrementVal}
        })

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
      res.status(200).json({ 
        success: true,
        message: 'successfully fetched all tags',
        tags: uniqueTags 
    });
    } catch (error) {
      // If there's an error, send error response
      return next(error);      
    }
};
  


export {  
    createBlog, 
    getLatestBlogPosts,
    getTrendingBlogs,
    searchBlogPosts,
    getBlogPost,
    likeBlogPost,   
    getAllTags
} 