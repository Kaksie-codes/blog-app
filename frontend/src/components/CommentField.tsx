import { toast} from "react-hot-toast";
import { useSelector } from "react-redux";
import { Blog } from "../pages/Home";
import { Dispatch, SetStateAction, useEffect, useState } from 'react'; 
// import { blogStructure } from "../pages/BlogPage";


const CommentField = ({
    action,
    authorId,
    parentId,
    blogId,
    value,
    page,
    commentId,    
    // blog,
    fetchComments,
    fetchTotalCommentsCount,
    getTotalRepliesCount,
    fetchReplies,    
    replyingTo = undefined,
    setIsReplying
}: {
    action:string,
    authorId: string,
    parentId?:string,
    blogId:string,
    value?: string,
    commentId?: string,
    page?:number,
    // setBlog:any,
    blog?: Blog,
    fetchComments?: (blogId: string, page:number) => Promise<void>;
    fetchReplies?: (_id: string) => Promise<void>;
    fetchTotalCommentsCount: (_id: string) => Promise<void>;
    getTotalRepliesCount?: (_id: string) => Promise<void>;
    index?: number,
    replyingTo?: string,
    setIsReplying?: Dispatch<SetStateAction<boolean>>;
}) => {
    
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state: any) => state.auth);
    const [loading, setLoading] = useState(false);

    // console.log('page in commentField', page)

    useEffect(() => {
        if (value !== undefined) {
            setComment(value);
        }
    }, [value]);

    const handleComment = () => {
        if(!userInfo){
            return toast.error('log in to leave a comment')
        }
        if(!comment.length){
            return toast.error('Write Something to leave a comment...')
        }
        createComment()
    }

    const handleEdit = async () => {        
        try{ 
            setLoading(true);
            const res = await fetch('/api/comment/edit-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId, 
                    editedComment: comment
                })
            })
            const { success, message } = await res.json();
            if(success){
                toast.success(message);
                setLoading(false);
                setComment("");

                if(fetchComments && page){
                    // fetchReplies?.(parentId)
                    fetchComments(blogId, page);                    
                }
                if(fetchReplies && parentId){
                    fetchReplies(parentId);
                }
                
                fetchTotalCommentsCount(blogId);
                if(parentId && getTotalRepliesCount){
                    getTotalRepliesCount(parentId) 
                }                
                setIsReplying ? setIsReplying(false) : null                            
            }else{
                toast.error(message);
                setLoading(false);
            }
            // console.log('comment stats', data)            
        }catch(error){
            console.log(error);
            setLoading(false);            
        } 
    }

    const createComment = async () => {               
        try{ 
            setLoading(true);
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
            const { success, message } = await res.json();
            if(success){
                toast.success(message);
                setLoading(false);
                setComment("");

                if(fetchComments && page){                    
                    fetchComments(blogId, page);
                }

                if(fetchReplies && parentId){
                    fetchReplies(parentId);
                }
                
                fetchTotalCommentsCount(blogId);

                if(parentId && getTotalRepliesCount){
                    getTotalRepliesCount(parentId)
                }                
                setIsReplying ? setIsReplying(false) : null                           
            }else{
                toast.error(message);
                setLoading(false);
            }
            // console.log('comment stats', data)            
        }catch(error){
            console.log(error);  
            setLoading(false);          
        } 
    }

  return (
    <> 
        <textarea 
            value={comment}
            placeholder="Leave a comment..."
            onChange={(e) => setComment(e.target.value)}
            className="input-box pl-5 resize-none placeholder:text-dark-grey h-[100px] overflow-auto"
        >            
        </textarea>
        <button 
            onClick={value ? handleEdit : handleComment}
            disabled={loading}
            className={`btn-dark mt-5 px-10 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {loading ? `${action}ing...` : action}
        </button>
    </>
  )
} 

export default CommentField