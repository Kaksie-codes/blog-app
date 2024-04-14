import { useState } from "react";
import CommentField from "./CommentField"
import Avatar from "./Avatar";
import { getDay, getTime } from "../libs/date";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CommentCardProps } from "./CommentCard";

const SubCommentCard = ({ 
    blog,  
    commentData,
    onCommentCreated
  } : CommentCardProps ) => {
    const {commented_by:{ username }, commentedAt, comment_level, parent_reply, comment, _id} = commentData;
    let { _id:blogId, author: {_id: authorId, personal_info} } = blog;
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
    <div className="my-5 flex items-start gap-3">
        <Avatar profileImg="" parentStyles="h-9 w-9" fullname="" username={username}/>
                <div className="">
                  <div className="flex gap-3 items-center">            
                    <p className="line-clamp-1 text-black font-semibold">@{username}</p>                    
                    <p className="min-w-fit text-dark-grey">{getTime(commentedAt)}</p>
                  </div>
                  <p className="font-gelasio text-xl"><span className="text-blue-700">
                    {
                        comment_level > 1 && (
                            <span className="text-blue-700 text-xl">{`@${parent_reply.username}   `}</span>
                            )}
                            </span>
                            {comment}
                    </p>  
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
                        username === _username  ? (
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
  )
}

export default SubCommentCard