// import { useState } from "react";
// import { blogStructure } from "../pages/BlogPage";
import AnimationWrapper from "../libs/page-animation";
import { CommentResponse } from "../pages/BlogPage";
import { Blog } from "../pages/Home";
import CommentCard from "./CommentCard";
import CommentField from "./CommentField"
import LoadMore from "./LoadMore";
import Nodata from "./Nodata";
import { Dispatch, SetStateAction, useEffect, useState } from 'react'; // Import Dispatch and SetStateAction types

export interface CommentStats {
    currentPage: number, 
    totalCount: number, 
    totalPages: number,
    deletedDocCount?: number 
} 

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
    const [comments, setComments] = useState<CommentResponse[]>([]); 
    const [commentStats, setCommentStats] = useState<CommentStats>({currentPage: 1, totalCount: 0, totalPages:1})
    const { author: {_id:authorId} , title, _id} = blog
    
        
    useEffect(() => {
        fetchComments(blog._id);        
    }, [blog._id]);

    const fetchComments = async (_id: string, page:number = 1) => {
        try {
            const res = await fetch(`/api/comment/get-comments-byId/${_id}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            // const data = await res.json();

            // console.log('dataComment ====>>', data)

            const { comments: blog_comments, totalCount, totalPages, currentPage } = await res.json();

            if(comments && comments.length > 0 && currentPage > 1){
                // Append fetched data to existing notifications
               setComments([...comments, ...blog_comments]);
           }else{
             setComments(blog_comments);
           }  

            setCommentStats({currentPage, totalCount, totalPages})
    
        } catch (error) {
            console.log(error);
        }
    }
    
    // console.log(' commentStats state  ======>>', commentStats)

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
             <LoadMore 
            state={commentStats} 
            fetchCommentsFunction={fetchComments}  
            blogId={_id}          
        />
        </div>       
    </div>
  )
}

export default CommentsContainer