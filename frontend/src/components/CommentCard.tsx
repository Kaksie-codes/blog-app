import { useSelector } from "react-redux";
import { getDay, getTime } from "../libs/date"
import Avatar from "./Avatar"
import toast from "react-hot-toast";
import { useState } from "react";
import CommentField from "./CommentField";
import { Blog } from "../pages/Home";
import SubCommentCard from "./SubCommentCard";
import AnimationWrapper from "../libs/page-animation";

export interface CommentCardProps {  
  onCommentCreated: (_id: string) => Promise<void>;
  blog: Blog,   
  commentData: {
    commented_by: {
      username: string;
    };
    children: any[];
    commentedAt: string; // Assuming the type of commentedAt is string, update as needed
    comment: string;
    comment_level: number;
    _id: string;    
    parent_reply:  any,
    blog_author: any
    // Add more specific types for commentData if available
  };
}

const CommentCard = ({ 
  blog,  
  commentData,
  onCommentCreated
} : CommentCardProps ) => {
  const {commented_by:{ username }, commentedAt, comment, _id, children} = commentData;
  const { userInfo } = useSelector((state: any) => state.auth); 
  const { username:_username } = userInfo 
  const [isReplying, setIsReplying] = useState<boolean>(false);  
  let { _id:blogId, author: {_id: authorId, personal_info} } = blog;
  // let { _id:blogId, author: {_id: authorId, personal_info:{username:author_username}} } = blog;
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const handleReply = async () => {
    if(!userInfo){
      toast.error('login first to leave a reply')
    }
    setIsReplying(!isReplying);
  }

  console.log('commentData >>>', commentData.blog_author.username)

  const handleLike = async () => {
    // if (!userInfo) {
    //     toast.error("Please log in to like this post");
    //     return;
    // }

    // try {
    //     const res = await fetch(`/api/post/like-blog`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ _id})
    //     });

    //     const { data, success, message } = await res.json();
        
    //     if(success){
    //         // setLikesCount(data.likesCount);
    //         setIsLikedByUser(data.likes.includes(userInfo.userId));
    //         toast.success(message);
    //     }                     
    // } catch (error) {
    //     console.error("Error toggling like:", error);
    //     toast.error("Failed to toggle like. Please try again later.");
    // }
};

  return (
    <div className="w-full">
      <div className="my-5 flex items-start gap-3">
        <Avatar profileImg="" parentStyles="h-12 w-12" fullname="" username={username}/>
        <div className="">
          <div className="flex gap-3 items-center">            
            <p className="line-clamp-1 text-black font-semibold">@{username}</p>
            <p className="min-w-fit text-dark-grey">{getTime(commentedAt)}</p>
          </div>
          <p className="font-gelasio text-xl">{comment}</p>  
          <div className="flex gap-5 items-center mt-1"> 
            <div className="flex items-center gap-6 justify-center">
              <div className="flex gap-3 items-center">
                <button onClick={handleLike}
                  className={`w-10 h-10 flex items-center rounded-full justify-center  ${isLikedByUser ? 'text-red bg-red/20' : 'bg-grey/80'}`}>
                  <i className={`fi fi-${isLikedByUser ? 'sr' : 'rr'}-heart`}></i>
                </button>
                <p>2</p>
              </div>
              {
                 username === _username || _username === commentData.blog_author.username ? (
                  <button>
                    <i className="fi fi-rr-trash"></i>
                  </button>
                ) : (
                  null
                )
              }              
              <button 
                onClick={handleReply}
                className="underline">
                  Reply
              </button>           
            </div>                     
          </div>          
          {
            children.length > 0 ? (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="mt-1  text-blue-700">
                  {
                    showReplies ? (
                      <p>Hide replies</p>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fi fi-rs-comment-dots"></i>
                        {`${children.length} ${children.length > 1 ? 'replies' : 'reply'}`}    
                      </div>
                    )
                  }                         
              </button>    
            ) : (
              null
            )
          }
          {
            isReplying ? (
              <div className="mt-2">
                <CommentField 
                  action="reply" 
                  replyingTo={_id}
                  setIsReplying={setIsReplying}
                  blogId={blogId}
                  authorId={authorId}
                  onCommentCreated={onCommentCreated}
                />
              </div>
            ) : (
              null
            )
          }        
        </div>
      </div>
      <div className={`ml-16 ${showReplies ? 'block' : 'hidden'}`}>
        {
          children.length > 0 && children.map((item, index) => {            
            return (
              <AnimationWrapper key={index}>
                <SubCommentCard
                  commentData={item}
                  blog={blog}
                  onCommentCreated={onCommentCreated}
                />
              </AnimationWrapper>
            )
          })
        }
      </div>
    </div>
  )
}

export default CommentCard