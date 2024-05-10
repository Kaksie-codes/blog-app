import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast";

const NotificationCommentField = ({
    blogId,
    blog_author,    
    replyingTo,
    setReplying,
} : {
    blogId:string,
    blog_author: string,    
    replyingTo: string,    
    setReplying: Dispatch<SetStateAction<boolean>>;    
}) => {
    let [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    

    const createReply = async () => {               
        try{ 
            setLoading(true);
            const res = await fetch('/api/comment/create-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId, 
                    blog_author,
                    comment,
                    replying_to: replyingTo,
                })
            })
            const { success, message } = await res.json();
            if(success){
                toast.success(message);
                setLoading(false);
                setComment(""); 
                setReplying(false)                           
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
    <div className="w-full">
        <textarea 
            name="" 
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="input-box w-full pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            placeholder="Leave a reply..."
        >            
        </textarea>
        <button 
            className={`btn-dark mt-5 px-10 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
            disabled={loading}
            onClick={createReply}
        >
            {loading ? `Replying...` : 'Reply'}
        </button>
    </div>
  )
}

export default NotificationCommentField