// import { useState } from "react";
// import { blogStructure } from "../pages/BlogPage";
import AnimationWrapper from "../libs/page-animation";
import { CommentResponse } from "../pages/BlogPage";
import { Blog } from "../pages/Home";
import CommentCard from "./CommentCard";
import CommentField from "./CommentField"
import Nodata from "./Nodata";
import { Dispatch, SetStateAction, useEffect, useState } from 'react'; // Import Dispatch and SetStateAction types

interface CommentsContainerProps {
    blog: Blog;
    setBlog: Dispatch<SetStateAction<Blog>>;
    setCommentsWrapper: Dispatch<SetStateAction<boolean>>;
    commentsWrapper: boolean;
    // comments: any[];
    // onCommentCreated: (_id: string) => Promise<void>;
    fetchTotalCommentsCount: (_id: string) => Promise<void>;
    // totalParentsComments: number;
    // setPage: Dispatch<SetStateAction<number>>; // Define the type of setPage
}

const CommentsContainer = ({ 
    blog,   
    // setBlog,
    setCommentsWrapper,
    commentsWrapper,    
    fetchTotalCommentsCount,
} : CommentsContainerProps) => { 
    const [page, setPage] = useState(1);   
    const [comments, setComments] = useState<CommentResponse[]>([]);      
    const [totalParentsComments, setTotalParentsComments] = useState(0);
    const { author: {_id:authorId} , title, _id} = blog
    
    // Function to handle "Load More" button click
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        fetchComments(blog._id);        
    }, [page, blog._id]);

    const fetchComments = async (_id: string) => {
        try {
            const res = await fetch(`/api/comment/get-comments-byId/${_id}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const { total_comments, comments: blog_comments } = await res.json();
                   
            // If it's the first page, set the comments directly
            if (page === 1) {
                setComments(blog_comments);
            } else {
                // Concatenate the new page of comments to the previous comments array
                setComments(prevComments => [...prevComments, ...blog_comments]);
            }
    
            // setTotalComments(total_comments);
           
            setTotalParentsComments(total_comments);
    
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className={`max-sm:w-full fixed ${commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]'} duration-700 max-sm:right-0 sm:top-0 w-[40%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}>
        <div className="relative">
            <h1 className="text-xl font-medium">Comments</h1>
            <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>
            <button 
                onClick={() => setCommentsWrapper((prevVal:boolean) => !prevVal)}
                className="absolute top-0 right-0 flex items-center justify-center rounded-full bg-grey w-12 h-12">
                <i className="fi fi-br-cross"></i>
            </button>
        </div>
        <hr className="border-grey my-8 w-[120%] -ml-10" />
        <CommentField 
            action="Comment" 
            fetchComments={fetchComments} 
            fetchTotalCommentsCount={fetchTotalCommentsCount} 
            authorId={authorId} 
            blogId={_id} 
            blog={blog}
        />
        <div>
            {
                comments && comments.length ? (
                    comments.map((comment:any, index:number) => {
                        return (
                            <AnimationWrapper key={index}>
                                <CommentCard                                    
                                    commentData={comment}
                                    blog={blog}
                                    fetchComments={fetchComments}
                                    fetchTotalCommentsCount={fetchTotalCommentsCount}
                                />                                
                            </AnimationWrapper>
                        );
                    })
                ) : (
                    <Nodata message="No comments"/>
                )
            }
        </div>
        {comments && comments.length < totalParentsComments && (
            <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            onClick={handleLoadMore}>
                Load More
            </button>
        )}
    </div>
  )
}

export default CommentsContainer