// import { useState } from "react";
// import { blogStructure } from "../pages/BlogPage";
import { Blog } from "../pages/Home";
import CommentField from "./CommentField"


const CommentsContainer = ({ 
    blog,   
    setCommentsWrapper,
    commentsWrapper
} : { 
    blog: Blog,   
    commentsWrapper:boolean,
    setCommentsWrapper:any
}) => {    
    const { author: {_id:author_id, }, title, _id} = blog
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
        <CommentField action="Comment" author_id={author_id} blog_id={_id}/>
    </div>
  )
}

export default CommentsContainer