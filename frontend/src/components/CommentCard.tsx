import { useSelector } from "react-redux";
import { getDay } from "../libs/date"
import Avatar from "./Avatar"
import toast from "react-hot-toast";
import { useState } from "react";
import CommentField from "./CommentField";
import { Blog } from "../pages/Home";

interface CommentCardProps {
  index: number;
  onCommentCreated: (_id: string) => Promise<void>;
  blog: Blog,
  leftVal: number;
  commentData: {
    commented_by: {
      username: string;
    };
    commentedAt: string; // Assuming the type of commentedAt is string, update as needed
    comment: string;
    _id: string;    
    // Add more specific types for commentData if available
  };
}

const CommentCard = ({
  index, 
  blog,
  leftVal, 
  commentData,
  onCommentCreated
} : CommentCardProps ) => {
  const {commented_by:{ username }, commentedAt, comment, _id} = commentData;
  const { userInfo } = useSelector((state: any) => state.auth);  
  const [isReplying, setIsReplying] = useState<boolean>(false);
  let { title, banner, comments, content, publishedAt,_id:blogId, author: {_id: authorId} } = blog;

  const handleReply = async () => {
    if(!userInfo){
      toast.error('login first to leave a reply')
    }
    setIsReplying(!isReplying);
  }

  return (
    <div className="w-full" style={{paddingLeft: `${leftVal}px`}}>
      <div className="my-5 p-6 rounded-md border-grey border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3 items-center">
            <Avatar profileImg="" parentStyles="h-6 w-6" fullname="" username={username}/>
            <p className="line-clamp-1">{username}</p>
          </div>
          <p className="min-w-fit">{getDay(commentedAt)}</p>          
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>
        <div className="flex gap-5 items-center ml-3">
          <button 
            onClick={handleReply}
            className="underline">Reply</button>
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

export default CommentCard