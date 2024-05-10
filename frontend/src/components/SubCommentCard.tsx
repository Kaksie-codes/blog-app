import {  useEffect, useState } from "react";
import CommentField from "./CommentField"
import Avatar from "./Avatar";
import { getTime } from "../libs/date";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Blog } from "../pages/Home";



export interface SubCommentCardProps {  
  fetchReplies: (_id: string) => Promise<void>;
  fetchTotalCommentsCount: (_id: string) => Promise<void>;
  getTotalRepliesCount: (_id: string) => Promise<void>;
  blog: Blog,  
  parentId:string, 
  commentData: {
    commented_by: {  
        personal_info: {
          username: string;
          profile_img: string; 
        };
        _id: string;  
    };
    parent_user_id: { 
        personal_info: {
          username: string;
          profile_img: string;           
        };
        _id: string; 
    };  
    activity: {
      total_likes: string,
      likes: string[]
    }  
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
    fetchTotalCommentsCount,
    getTotalRepliesCount
  } : SubCommentCardProps) => {
    console.log('commentData in subCard ==>', commentData)
    const {
      commented_by:{ personal_info:{ username:commenter_username, profile_img }, _id:comment_author }, 
      commentedAt, comment_level, 
      comment, 
      _id:commentId,
      activity: {total_likes, likes},  
      parent_user_id:parentUserData  
    } = commentData;

    // Destructure parent username only if parent_user_id exists
    const parent = parentUserData ? parentUserData.personal_info.username : null;
    let { _id:blogId, author: {_id: authorId} } = blog;
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
    const { userInfo } = useSelector((state: any) => state.auth);  
    // const { username:_username } = userInfo;
    const _username = userInfo ? userInfo.username : null;
    const [likesCount, setLikesCount] = useState(total_likes); 
    const [isEditing, setIsEditing] = useState<boolean>(false);   


  

    const handleReply = async () => {
        if(!userInfo){
          toast.error('login first to leave a reply')
        }
        setIsReplying(!isReplying);        
    }

    const deleteComment = async () => {
      try {
          const url = `/api/comment/delete-comment/${commentId}`;
          console.log("Fetching replies from URL:", url);
          const res = await fetch(url, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" }
          });
    
          const { success, message } = await res.json();
          if(success){
            toast.success(message);
            fetchReplies(parentId);
            getTotalRepliesCount(parentId);
            fetchTotalCommentsCount(blogId);
          }else{
            toast.error(message);
          }
      } catch (error) {
          console.log(error);
      }
    }

    const editComment = () => { 
      setIsEditing(!isEditing);    
    }

    const handleLike = async () => {
      if (!userInfo) {
          toast.error("Please log in to like this post");
          return;
      }
    
      try {
          const res = await fetch(`/api/comment/like-comment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                commentId,
                comment_author,
                blogId  
              })
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
    
    useEffect(() => {
      // Check if the user's ID exists in the array of liked users
      if (userInfo) {
          setIsLikedByUser(likes.includes(userInfo.userId));
          setLikesCount(total_likes);
      }
    }, [userInfo, likes]);

  return (
    <div className="my-5 flex items-start gap-3">
        <Avatar profileImg={profile_img} parentStyles="h-9 w-9" fullname="" username={commenter_username}/>
          <div className="">
            <div className="flex gap-3 items-center">            
              <p className="line-clamp-1 text-black font-semibold">@{commenter_username}</p>                    
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
                  <p>{likesCount}</p>
                </div>
                {
                  commenter_username === _username || _username === commentData.blog_author.username  ? (
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
                {
                 commenter_username === _username || _username === commentData.blog_author.username ? (
                  <button onClick={() => editComment()}>
                    <p className="underline">Edit</p>
                  </button>
                ) : (
                  null
                )
              }              
              </div>                     
            </div> 
            {
              isReplying ? (
                <div className="mt-2">
                  <CommentField 
                    action="reply" 
                    replyingTo={commentId}
                    setIsReplying={setIsReplying}
                    blogId={blogId}
                    authorId={authorId}
                    fetchTotalCommentsCount={fetchTotalCommentsCount}
                    getTotalRepliesCount={getTotalRepliesCount}
                    parentId={parentId}
                    fetchReplies={fetchReplies}                  
                  />
                </div>
              ) : (
                null
              )
            }
            {
            isEditing ? (
              <div className="mt-2">
                <CommentField 
                  action="Edit" 
                  value={comment}
                  commentId={commentId}
                  replyingTo={parentId}
                  setIsReplying={setIsEditing}
                  blogId={blogId}
                  fetchComments={fetchReplies}
                  authorId={authorId}
                  fetchTotalCommentsCount={fetchTotalCommentsCount}
                  getTotalRepliesCount={getTotalRepliesCount}
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