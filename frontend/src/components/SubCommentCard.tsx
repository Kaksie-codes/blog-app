import { useEffect, useState } from "react";
import CommentField from "./CommentField"
import Avatar from "./Avatar";
import { getTime } from "../libs/date";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Blog } from "../pages/Home";



export interface SubCommentCardProps {  
  fetchReplies: (_id: string) => Promise<void>;
  fetchTotalCommentsCount: (_id: string) => Promise<void>;
  blog: Blog,  
  parentId:string, 
  commentData: {
    commented_by: {      
        username: string;
        profile_img: string;            
    };
    parent_user: {      
        username: string;
        profile_img: string; 
        _id: string;           
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

const SubCommentCard = ({ 
    blog,  
    parentId,
    commentData,
    fetchReplies,
    fetchTotalCommentsCount
  } : SubCommentCardProps) => {
    const {commented_by:{username,profile_img}, commentedAt, comment_level, comment, _id, parent_user: {username: parent,}} = commentData;
    let { _id:blogId, author: {_id: authorId} } = blog;
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
    const { userInfo } = useSelector((state: any) => state.auth); 
    const { username:_username } = userInfo 

    const handleReply = async () => {
        if(!userInfo){
          toast.error('login first to leave a reply')
        }
        setIsReplying(!isReplying);        
      }

    // useEffect(() => {
    //   fetchReplies(parentId);
    // }, [isReplying])

    const deleteComment = () => {
        
    }

    const handleLike = async () => {
        setIsLikedByUser(!isLikedByUser)
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
    <div className="my-5 flex items-start gap-3 bg-red">
        <Avatar profileImg={profile_img} parentStyles="h-9 w-9" fullname="" username={username}/>
          <div className="">
            <div className="flex gap-3 items-center">            
              <p className="line-clamp-1 text-black font-semibold">@{username}</p>                    
              <p className="min-w-fit text-dark-grey">{getTime(commentedAt)}</p>
            </div>
            <p className="font-gelasio text-xl">
              <span className="text-blue-700">
                {
                  comment_level > 1 && (
                    <span className="text-blue-700 text-xl">
                      {`@${parent}   `}
                    </span>
                  )
                }
              </span>
              {comment}
            </p>  
            <div className="flex gap-5 items-center mt-1"> 
              <div className="flex items-center gap-6 justify-center">
                <div className="flex gap-3 items-center justify-center">
                  <button onClick={handleLike}>
                    <i className={`fi ${isLikedByUser ? 'fi-sr-heart text-red' : 'fi-rr-heart'}`}></i>
                  </button>
                  <p>2</p>
                </div>
                {
                  username === _username || _username === commentData.blog_author.username  ? (
                    <button onClick={deleteComment}>
                      <i className="fi fi-rr-trash hover:text-red"></i>
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
              isReplying ? (
                <div className="mt-2">
                  <CommentField 
                    action="reply" 
                    replyingTo={_id}
                    setIsReplying={setIsReplying}
                    blogId={blogId}
                    authorId={authorId}
                    fetchTotalCommentsCount={fetchTotalCommentsCount}
                    parentId={parentId}
                    fetchReplies={fetchReplies}                  
                  />
                </div>
              ) : (
                null
              )
            }        
        </div>
    </div>
  )
}

export default SubCommentCard