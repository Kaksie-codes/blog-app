import BlogPost from '../models/blogPost.model.js'
import User from '../models/user.model.js'
import Notification from '../models/Notification.model.js';
import handleError from '../utils/error.js';
import generateSlug from '../utils/generateSlug.js';


const createBlog = async (req, res, next) => {
    
    let authorId = req.user.id;
    // let authorId = req.user;
    let { title, description, banner, tags, content, draft, id } = req.body;

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
        let blog_id = id || generateSlug(title);              
        
        try { 
            
            if(id){
            // Logic to update the blog post if te id already exists
                const updatedBlogPost = await BlogPost.findOneAndUpdate({blog_id}, { title, description, banner, content, tags, draft: draft ? draft : false});

                res.status(200).json({ success: true, message: 'Blog post updated successfully', data: blog_id });
            }else{
            // Logic to create the blog post            
            const newBlogPost = new BlogPost({
                ...req.body,
                tags: lowerCaseTags,                
                blog_id,
                author: authorId,
                draft: Boolean(draft)
              });
              
            const savedPost = await newBlogPost.save();
            let incrementVal = draft ? 0 : 1;

            await User.findOneAndUpdate({_id: authorId}, { $inc: {"account_info.total_posts": incrementVal}, $push: { 'blogPosts' : savedPost._id }})
            
            res.status(200).json({ success: true, message: 'Blog post created successfully', data: blog_id });
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
   
    let user_id = req.user.id;
    let { _id, isLikedByUser } = req.body
    let incrementval = isLikedByUser ? -1 : 1
    try {
       const likedBlogPost = await  BlogPost.findOneAndUpdate({_id}, {$inc: {"activity.total_likes": incrementval}});

       if(isLikedByUser){
        let like = new Notification({
            type: 'like',
            blogPost:_id,
            notification_for: likedBlogPost.author,
            user: user_id
        })
        like.save();
        return res.status(200).json({liked_by_user: true})
       }else{
        await Notification.findOneAndDelete({user: user_id, blog:_id, type: "like"})
        return  res.status(200).json({ liked_by_user: false})
        // .then(data => {
        //   return  res.status(200).json({ liked_by_user: false})
        // })
        // .catch(err){
        //    return next(err)
        // }
       }
    } catch (error) {
        console.error("Error liking post:", error);
        return next(error);        
    }
};

const getLikeStatus = async (req, res, next) => {
    let user_id = req.user.id;
    const { _id } = req.body
    console.log('request body >>>',req.body)
    try{
        const notification = await  Notification.exists({user: user_id, type: "like", blogPost: _id})
        res.status(200).json({result: notification})
    }catch(error){
        console.error("Error reading like status:", error);
        return next(error); 
    }
}


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
        .select("blog_id title description banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
        
        res.status(200).json({ 
            success: true, 
            message: 'latest Blogs', 
            results: latestBlogPosts,
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
        .select("blog_id title publishedAt -_id")
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
            console.log('tag', tag)
            searchQuery = { tags:tag, draft:false, blog_id:{ $ne: eliminate_blog} };  
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
            message: `Search result for ${tag ? tag : query}'`, 
            results: searchedBlogs,
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
        const { blog_id, draft, mode } = req.body;
        let incrementVal = mode != 'edit' ? 1 : 0
        const blogPost =  await BlogPost.findOneAndUpdate({ blog_id }, {$inc: {"activity.total_reads": incrementVal}})
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname _id")
        .select("title description content banner activity publishedAt blog_id tags")

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



export {  
    createBlog, 
    getLatestBlogPosts,
    getTrendingBlogs,
    searchBlogPosts,
    getBlogPost,
    likeBlogPost,
    getLikeStatus
} 