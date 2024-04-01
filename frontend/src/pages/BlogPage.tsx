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

export const blogStructure = {
    activity:{
        total_comments: 0,
        total_likes: 0,
        total_parent_comments: 0,
        total_reads: 0
    },
    author: {
        personal_info:{
            fullname: '',
            username: '',
            profile_img: ''
        }
    },
    banner: '',
    blog_id: '',
    content: [''],
    description: '',
    publishedAt: '',
    tags: [''],
    title: '',
    _id: ''
}   
  

const BlogPage = () => {
    const { blog_id } = useParams();
    const [blog, setBlog] = useState<Blog>(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState<Blog[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentsWrapper, setCommentsWrapper] = useState<boolean>(false);
    const [totalParentsCommentsLoaded, setTotalParentsCommentsLoaded] = useState(0);

    let { title, banner, content, publishedAt,_id } = blog;
    let { author : {personal_info: {fullname, username:author_username, profile_img}}} = blog;
    

    const fetchBlogPost = async() => {
        try{ 
            const res = await fetch('/api/post/get-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({blog_id})
            })
            const { blogPost } = await res.json();
            // console.log('blogPost', blogPost.content)
            if(blogPost != null){                
                setBlog(blogPost);
                setIsLoading(false)
                fetchRelatedBlogs(blogPost.tags);                
            }
            console.log('blogPost', blogPost);
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
                    body: JSON.stringify({ tag: tags[0], limit: 2, eliminate_blog: blog_id })
                });
                const { results } = await res.json();
                // console.log('similar blogPost', results);
                setSimilarBlogs(results);
            } else {
                console.log('No tags found for the blog.');
            }
        } catch (error) {
            console.log(error);
            // Handle error
        }
    };

    useEffect(() => {
        fetchBlogPost();
    },[blog_id])

  return (
    <AnimationWrapper>
        {
            isLoading ? (
                <Loader/>
            ) : (
                <div className="max-w-[900px] center py-10 container">
                    <CommentsContainer
                        blog={blog}                        
                        commentsWrapper={commentsWrapper} 
                        setCommentsWrapper={setCommentsWrapper}
                    />
                    <img src={banner} alt="banner image" className="aspect-video bg-grey" />
                    <div className="mt-12">
                        <h2 className="">{title}</h2>
                        <div className="flex max-sm:flex-col my-8 justify-between">
                            <div className="flex gap-5 items-start">
                                <img src={profile_img} alt="profile image"  className="w-12 h-12 rounded-full" />
                                <p className="Capitalize">
                                    <span className="text-xl font-bold">{fullname}</span>
                                    <br />
                                    @
                                    <Link to={`/users/${author_username}`} className="underline">
                                            {author_username}
                                    </Link>
                                </p>
                            </div>
                            <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                Published on {getDay(publishedAt)} 
                                {/* {getFullDay(publishedAt)} */}
                            </p>
                        </div>
                    </div>
                    {
                        _id  && <BlogInteraction                                    
                                    setCommentsWrapper={setCommentsWrapper}
                                    blog={blog}
                                />
                    }
                    <div className="my-12 font-gelasio blog-page-content">                        
                        <BlogContent content={content}/>
                    </div>
                    {
                        _id  && <BlogInteraction                                    
                                    setCommentsWrapper={setCommentsWrapper}
                                    blog={blog}
                                />
                    }
                    {
                        similarBlogs !=null ? (
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
                            <h1>No similar blogs found</h1>
                        )
                    }
                </div>
            )
        }
    </AnimationWrapper>
  )
}

export default BlogPage