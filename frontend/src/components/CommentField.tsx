import { useState } from "react"
import { toast} from "react-hot-toast";
import { useSelector } from "react-redux";
import { Blog } from "../pages/Home";
// import { blogStructure } from "../pages/BlogPage";


const CommentField = ({
    action,
    authorId,
    blogId,
    setBlog,
    blog
}: {
    action:string,
    authorId: string,
    blogId:string,
    setBlog:any,
    blog: Blog
}) => {
    
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state: any) => state.auth);
    const { fullname, profile_img, username} = userInfo
    // const username = userInfo ? userInfo.username : ''; 
    // const accessToken = currentUser ? currentUser.accessToken : '';
    let { title, banner, comments, content, publishedAt,_id } = blog;

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
                    comment
                })
            })
            const { success, data, message } = await res.json();
            if(success){
                toast.success(message);
                setComment("");
                data.commented_by = {userInfo: {
                    username,
                    profile_img,
                    fullname
                }}
            
                let newCommentArray;
                data.childrenLevel = 0;
                newCommentArray = [data]

                let parentCommentIncrementVal = 1;

                setBlog({...blog, comments: {...comments, results: newCommentArray}})

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