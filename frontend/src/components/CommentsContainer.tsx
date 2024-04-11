// import { useState } from "react";
// import { blogStructure } from "../pages/BlogPage";
import AnimationWrapper from "../libs/page-animation";
import { Blog } from "../pages/Home";
import CommentCard from "./CommentCard";
import CommentField from "./CommentField"
import Nodata from "./Nodata";


const CommentsContainer = ({ 
    blog,   
    setBlog,
    setCommentsWrapper,
    commentsWrapper,
    comments,
    onCommentCreated
} : { 
    blog: Blog,
    setBlog: any,   
    commentsWrapper:boolean,
    setCommentsWrapper:any,
    comments: any,
    onCommentCreated: (_id: string) => Promise<void>;
}) => {    
    const { author: {_id:authorId} , title, _id} = blog
    // console.log('blog >>>', blog)
  return (
    <div className={`max-sm:w-full fixed ${commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]'} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}>
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
        <CommentField action="Comment" onCommentCreated={onCommentCreated} authorId={authorId} blogId={_id} blog={blog} setBlog={setBlog}/>
        <div>
            {
                comments && comments.length ? (
                    comments.map((comment:any, index:number) => {
                        return (
                            <AnimationWrapper key={index}>
                                <CommentCard
                                    index={index}
                                    leftVal={comment.childrenLevel * 4}
                                    commentData={comment}
                                />                                
                            </AnimationWrapper>
                        );
                    })
                ) : (
                    <Nodata message="No comments"/>
                )
            }
        </div>
        
    </div>
  )
}

export default CommentsContainer