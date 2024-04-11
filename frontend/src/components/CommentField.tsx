import { toast} from "react-hot-toast";
import { useSelector } from "react-redux";
import { Blog } from "../pages/Home";
import { Dispatch, SetStateAction, useState } from 'react'; 
// import { blogStructure } from "../pages/BlogPage";


const CommentField = ({
    action,
    authorId,
    blogId,
    // setBlog,
    blog,
    onCommentCreated,
    index = undefined,
    replyingTo = undefined,
    setIsReplying
}: {
    action:string,
    authorId: string,
    blogId:string,
    // setBlog:any,
    blog?: Blog,
    onCommentCreated: (_id: string) => Promise<void>;
    index?: number | undefined,
    replyingTo?: string | undefined,
    setIsReplying?: Dispatch<SetStateAction<boolean>>;
}) => {
    
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state: any) => state.auth);
    // const { fullname, profile_img, username} = userInfo
    // const username = userInfo ? userInfo.username : ''; 
    // const accessToken = currentUser ? currentUser.accessToken : '';
    // let { title, banner, comments, content, publishedAt,_id } = blog;

    const handleComment = () => {
        if(!userInfo){
            return toast.error('log in to leave a comment')
        }

        if(!comment.length){
            return toast.error('Write Something to leave a comment...')
        }
        createComment()
    }

    const createComment = async () => { 
        try{ 
            const res = await fetch('/api/comment/create-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId, 
                    blog_author: authorId,
                    comment,
                    replying_to: replyingTo,

                })
            })
            const { success, data, message } = await res.json();
            if(success){
                toast.success(message);
                setComment("");
                onCommentCreated(blogId);
                setIsReplying ? setIsReplying(false) : null                           
            }else{
                toast.error(message);
            }
            console.log('comment stats', data)
            
        }catch(error){
            console.log(error);            
        } 
    }

  return (
    <> 
        <textarea 
            value={comment}
            placeholder="Leave a comment..."
            onChange={(e) => setComment(e.target.value)}
            className="input-box pl-5 resize-none placeholder:text-dark-grey h-[150px] overflow-auto"
        >            
        </textarea>
        <button 
            onClick={handleComment}
            className="btn-dark mt-5 px-10">{action}</button>
    </>
  )
}

export default CommentField