import { useSelector } from "react-redux";
import { getTime } from "../libs/date"
import Avatar from "./Avatar"
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CommentField from "./CommentField";
import { Blog } from "../pages/Home";
import SubCommentCard from "./SubCommentCard";
import AnimationWrapper from "../libs/page-animation";
import { CommentResponse } from "../pages/BlogPage";

export interface CommentCardProps {  
  fetchComments: (_id: string) => Promise<void>;
  fetchTotalCommentsCount: (_id: string) => Promise<void>;
  blog: Blog, 
  page:number,  
  commentData: {
    commented_by: {
      personal_info: {
        username: string;
        profile_img: string;       
      };
      _id: string            
    };
    children: any[];
    commentedAt: string; // Assuming the type of commentedAt is string, update as needed
    comment: string;
    comment_level: number;
    _id: string;    
    parent_reply:  any;
    blog_author:{ 
      personal_info: {
        username: string;
        profile_img: string;       
      }
      _id: string;
    };    
    activity: {
      total_likes: string,
      likes: string[]
    }
    // Add more specific types for commentData if available
  };
} 

const CommentCard = ({ 
  blog,  
  commentData,
  page,
  fetchComments,
  fetchTotalCommentsCount
} : CommentCardProps ) => {
  // console.log('page in commentCard ======>>>', page)
  const {
    commented_by: { personal_info:{ username, profile_img}, _id:comment_author}, 
    commentedAt, 
    children,  
    comment, 
    _id:parentId, 
    activity: {total_likes, likes} 
  } = commentData;
 
  const { userInfo } = useSelector((state: any) => state.auth); 
  const { username: _username } = userInfo || {}; 
  const [isReplying, setIsReplying] = useState<boolean>(false);  
  const [isEditing, setIsEditing] = useState<boolean>(false);  
  let { _id:blogId, author: {_id: authorId} } = blog;  
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<CommentResponse[]>([]);
  const [totalRepliesCount, setTotalRepliesCount] = useState<number>(0);
  const [likesCount, setLikesCount] = useState(total_likes);  
 

  const handleReply = async () => {
    if(!userInfo){
      toast.error('login first to leave a reply')
    }
    setIsReplying(!isReplying);
  } 

  const handleReveal = (parentId:string) => {
    setShowReplies(!showReplies);
    fetchReplies(parentId);    
  }

  const editComment = () => { 
    setIsEditing(!isEditing);    
  }

    const fetchReplies = async (parentId: string) => {
      try {
          const url = `/api/comment/get-replies-byId/${parentId}`;       
          const res = await fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
          });

          const { replies } = await res.json();
          setReplies(replies)
          // console.log('replies ===>>', replies)
          
      } catch (error) {
          console.log(error);
      }
  }

  const getTotalRepliesCount = async (parentId: string) => {
    // console.log('fetching repliesCount  ===>>>')
    try {
        const url = `/api/comment/get-total-replies-byId/${parentId}`;        
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const { total_replies_count } = await res.json();
        // console.log('repliesCount successfull ===>>>', total_replies_count)
        setTotalRepliesCount(total_replies_count);
        
    } catch (error) {
        console.log(error);
    }
  }

  const deleteComment = async () => {
    try {
        const url = `/api/comment/delete-comment/${parentId}`;
        console.log("Fetching replies from URL:", url);
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const { success, message } = await res.json();
        
        if(success){
          toast.success(message);
          fetchComments(blogId);
          fetchTotalCommentsCount(blogId);
        }else{
          toast.error(message);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getTotalRepliesCount(parentId);
  }, [getTotalRepliesCount, totalRepliesCount])

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
              commentId: parentId,
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
 
// console.log('commentData ======>>>', commentData)
// console.log('commentData.blog_author ======>>>', commentData.blog_author )

  return (
    <div className="w-full">
      <div className="my-5 flex items-start gap-3">
        <Avatar profileImg={profile_img} parentStyles="h-12 w-12" fullname="" username={username}/>
        <div className="">
          <div className="flex gap-3 items-center">            
            <p className="line-clamp-1 text-black font-semibold">@{username}</p>
            <p className="min-w-fit text-dark-grey">{getTime(commentedAt)}</p>
          </div>
          <p className="font-gelasio text-xl">{comment}</p>  
          <div className="flex gap-5 items-center mt-1"> 
            <div className="flex items-center gap-6 justify-center">
              <div className="flex gap-3 items-center">
                <button onClick={handleLike}>
                  <i className={`fi ${isLikedByUser ? 'fi-sr-heart text-red' : 'fi-rr-heart'}`}></i>
                </button>
                <p>{likesCount}</p>
              </div>             
                     
              {
                 username === _username || _username === commentData.blog_author.personal_info.username ? (
                  <button onClick={deleteComment}>
                    <i className="fi fi-rr-trash hover:text-red"></i>
                  </button>
                ) : (
                  null
                )
              }              
              <button 
                onClick={handleReply}
                className="underline"
              >
                  Reply
              </button> 
              {
                 username === _username ? (
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
            children.length > 0 ? (
              <button 
                onClick={() => handleReveal(parentId)}
                className="mt-1  text-blue-700">
                  {
                    showReplies ? (
                      <p>Hide replies</p>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fi fi-rs-comment-dots"></i>
                        {`${totalRepliesCount} ${totalRepliesCount > 1 ? 'replies' : 'reply'}`}    
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
                  replyingTo={parentId}
                  parentId={parentId}
                  setIsReplying={setIsReplying}
                  blogId={blogId}
                  page={page}
                  authorId={authorId}
                  fetchComments={fetchComments}
                  fetchReplies={fetchReplies}
                  fetchTotalCommentsCount={fetchTotalCommentsCount}
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
                  replyingTo={parentId}
                  setIsReplying={setIsEditing}
                  blogId={blogId}
                  authorId={authorId}
                  commentId={parentId}
                  page={page}
                  fetchComments={fetchComments}
                  fetchTotalCommentsCount={fetchTotalCommentsCount}
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
          replies && replies.length > 0 && replies.map((item: any, index: number) => {            
            return (
              <AnimationWrapper key={index}>
                <SubCommentCard
                  commentData={item}
                  blog={blog} 
                  parentId={parentId}
                  fetchReplies={fetchReplies}
                  fetchTotalCommentsCount={fetchTotalCommentsCount}
                  getTotalRepliesCount={getTotalRepliesCount}
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