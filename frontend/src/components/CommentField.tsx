import { useState } from "react"
import { Toaster, toast} from "react-hot-toast";
import { useSelector } from "react-redux";
import { Blog } from "../pages/Home";
import { blogStructure } from "../pages/BlogPage";


const CommentField = ({
    action,
    author_id,
    blog_id
}: {
    action:string,
    author_id: string,
    blog_id:string
}) => {
    
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state: any) => state.auth);
    // const username = currentUser ? currentUser.username : ''; 
    // const accessToken = currentUser ? currentUser.accessToken : '';
    // let { title, banner, content, publishedAt,_id } = blog;

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
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blog_id, 
                    blog_author:author_id,
                    comment
                })
            })
            const blogPost  = await res.json();
            console.log('comment stats', blogPost)
            // if(blogPost != null){                
            //     setBlog(blogPost);
            //     setIsLoading(false)
            //     fetchRelatedBlogs(blogPost.tags);                
            // }
            // console.log('blogPost', blogPost);
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