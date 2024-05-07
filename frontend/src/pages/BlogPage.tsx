import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Blog } from "./Home";
import Loader from "../components/Loader";
import AnimationWrapper from "../libs/page-animation";
import { getDay } from "../libs/date";
import BlogInteraction from "../components/BlogInteraction";
import BlogCard from "../components/BlogCard";
import BlogContent from "../components/BlogContent";
import CommentsContainer from "../components/CommentsContainer";
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Nodata from "../components/Nodata";

export const blogStructure = {
    activity:{
        total_comments: 0,
        total_likes: 0,
        total_parent_comments: 0,
        total_reads: 0,
        likes: []
    },
    author: {
        personal_info:{
            fullname: '',
            username: '',
            profile_img: ''
        },
        _id: ''
    },
    banner: '',
    slug: '',
    content: '',
    description: '',
    publishedAt: '',
    tags: [''],
    title: '',
    comments: '',
    _id: ''
}   
export interface CommentResponse {
    _id: string,
    blog_id: string,
    blog_author: string,
    comment: string,
    commented_by: {
        _id: string,
        username: string,
        profile_img: string
    },
    parent_user: {
        _id: string,
        username: string,
        profile_img: string
    },
    isReply: string,
    parent: string,    
    commentedAt: string
} 

const BlogPage = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState<Blog>(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState<Blog[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [commentsWrapper, setCommentsWrapper] = useState<boolean>(false);
    

    let { title, banner, content, publishedAt,_id:blogId } = blog;
    let { author : {personal_info: {fullname, username:author_username, profile_img}}} = blog;
    let {activity: { total_comments, total_likes, likes} } = blog;
    const [totalComments, setTotalComments] = useState<number>(total_comments);
    const { userInfo } = useSelector((state: any) => state.auth);        
    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState(total_likes);

    console.log("comment >>", blog);

    // console.log('id >>', _id)
    useEffect(() => {
        // Check if the user's ID exists in the array of liked users
        if (userInfo) {
            setIsLikedByUser(likes.includes(userInfo.userId));
            setLikesCount(total_likes);
        }
    }, [userInfo, likes]);

    const fetchTotalCommentsCount = async (blogId : string) => {
        try {
            const res = await fetch(`/api/comment/get-total-comments-count-byId/${blogId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const { total_comments } = await res.json(); 
            setTotalComments(total_comments);     
        } catch (error) {
            console.log(error);
        }
    };

    const handleLike = async () => {
        if (!userInfo) {
            toast.error("Please log in to like this post");
            return;
        }

        try {
            const res = await fetch(`/api/post/like-blog`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blogId })
            });
    
            const { data, success, message } = await res.json();
            
            if(success){
                setLikesCount(data.likesCount);
                setIsLikedByUser(data.likes.includes(userInfo.userId));
                toast.success(message);
            }                     
        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Failed to toggle like. Please try again later.");
        }
    };    
    
    const fetchBlogPost = async() => {
        try{ 
            const res = await fetch('/api/post/get-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({slug})
            })
            const { blogPost } = await res.json();
            
            if(blogPost != null){                
                setBlog(blogPost); 
                setIsLoading(false)
                fetchRelatedBlogs(blogPost.tags); 
            }
           
        }catch(error){
            console.log(error);            
        } 
    }
    
    const fetchRelatedBlogs = async (tags: string[]) => {
        try {
            if (tags && tags.length > 0) {
                const res = await fetch('/api/post/search-blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tag: tags[0], limit: 2, eliminate_blog: slug })
                });
                const { data } = await res.json();                
                setSimilarBlogs(data);
            } else {
                console.log('No tags found for the blog.');
            }
        } catch (error) {
            console.log(error);            
        }
    };

    useEffect(() => {
        fetchBlogPost();        
    },[slug])   

    useEffect(() => {
        fetchTotalCommentsCount(blogId);        
    }, [blogId])

  return (
    <AnimationWrapper>
        {
            isLoading ? (
                <div className="w-screen h-screen flex items-center justify-center">
                    <Loader/>
                </div>
            ) : (
                <div className="max-w-[900px] center py-10 container">
                    <CommentsContainer
                        blog={blog} 
                        setBlog={setBlog}                       
                        commentsWrapper={commentsWrapper} 
                        setCommentsWrapper={setCommentsWrapper}                       
                        fetchTotalCommentsCount={fetchTotalCommentsCount}                        
                    />
                    <img src={banner} alt="banner image" className="aspect-video bg-grey" />
                    <div className="mt-12">
                        <h2 className="">{title}</h2>
                        <div className="flex max-sm:flex-col my-8 justify-between">
                            <div className="flex gap-5 items-start">
                                <Avatar
                                    parentStyles="w-12 h-12"
                                    fullname={fullname}
                                    username={author_username}
                                    profileImg={profile_img}
                                />                            
                                <p className="Capitalize">
                                    <span className="text-xl font-bold">{fullname}</span>
                                    <br />
                                    @
                                    <Link to={`/users/${author_username}`} className="">
                                            {author_username}
                                    </Link>
                                </p>
                            </div>
                            <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                Published on {getDay(publishedAt)}                                 
                            </p>
                        </div>
                    </div>
                    { 
                        blogId  && <BlogInteraction 
                                    handleLike={handleLike}   
                                    likesCount={likesCount}  
                                    isLikedByUser ={isLikedByUser}                              
                                    setCommentsWrapper={setCommentsWrapper}
                                    blog={blog}
                                    totalComments={totalComments}
                                />
                    }
                    <div className="my-12 font-gelasio blog-page-content">                        
                        <BlogContent content={content}/>
                    </div>
                    {
                       blogId  && <BlogInteraction
                                    handleLike={handleLike}   
                                    likesCount={likesCount}  
                                    isLikedByUser ={isLikedByUser }                              
                                    setCommentsWrapper={setCommentsWrapper}
                                    blog={blog}
                                    totalComments={totalComments}
                                />
                    }
                    {
                        similarBlogs && similarBlogs.length ? (
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                                {
                                    similarBlogs.map((blog, index) => {                                        
                                        return (
                                            <AnimationWrapper key={index} transition={{duration:1, delay: index*0.08}}>
                                                <BlogCard content={blog}/>
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                            </>

                        ) : (
                            // <h1>No similar blogs found</h1>
                            <Nodata message="No similar blogs found"/>
                        )
                    }
                </div>
            )
        }
    </AnimationWrapper>
  )
}

export default BlogPage