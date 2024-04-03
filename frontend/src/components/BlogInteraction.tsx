import { Link, useParams } from "react-router-dom";
import { Blog } from "../pages/Home"
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const BlogInteraction = ({ 
    blog,   
    setCommentsWrapper
    } : { 
    blog:Blog,    
    setCommentsWrapper:any   
}) => {
    // const { blog_id } = useParams();
    let {activity: { total_comments, total_likes}, _id } = blog;
    let { title, slug } = blog;
    let { author : {personal_info: { username: author_username }}} = blog;
    // const { currentUser: { username, accessToken} } = useSelector((state:any) => state.user);
    const { userInfo } = useSelector((state: any) => state.auth);
    const username = userInfo ? userInfo.username : ''; 
    // const accessToken = currentUser ? currentUser.accessToken : ''; 
    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState(total_likes)

    //  console.log('_id >>>', _id)
    const handleLike = async () => {
        if (!userInfo) {
            toast.error("Please log in to like this post");
            return;
        }else{
            setIsLikedByUser(!isLikedByUser);
            sendLikesStatus()
            setLikesCount(prevCount => !isLikedByUser ? prevCount + 1 : prevCount - 1); 
        }       
    };

    const sendLikesStatus = async () => {
        try {
            const res = await fetch(`/api/post/like-blog`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id, isLikedByUser})
            });

            const { liked_by_user } = await res.json();
            // console.log('like by user >>>', liked_by_user)            
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like the post. Please try again later.");
        }
    }
    const getLikesCount = async () => {
        try {
            const res = await fetch(`/api/post/isliked-by-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id})
            });

            const { result } = await res.json();
            console.log('got user like >>>', result) 
            setIsLikedByUser(Boolean(result))           
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like the post. Please try again later.");
        }
    }

    useEffect(() => {
        if(userInfo){
            getLikesCount()
        }        
    }, [])
 

  return (
    <div>
        <Toaster/>
        <hr className="border-grey my-2"/>
        <div className="flex gap-6 justify-between">
            <div className="flex gap-3 items-center">
                <div className="flex gap-3 items-center">
                    <button onClick={handleLike}
                     className={`w-10 h-10 flex items-center rounded-full justify-center  ${isLikedByUser ? 'text-red bg-red/20' : 'bg-grey/80'}`}>
                        <i className={`fi fi-${isLikedByUser ? 'sr' : 'rr'}-heart`}></i>
                    </button>
                    <p>{likesCount}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button 
                        className="w-10 h-10 flex items-center rounded-full justify-center bg-grey/80"
                        onClick={() => setCommentsWrapper((prevVal:boolean) => !prevVal)}>
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p>{total_comments}</p>
                </div>
            </div>
            <div className="flex gap-6 items-center justify-center">
                {
                    username == author_username && <Link to={`/editor/${slug}`} className="underline hover:text-purple">Edit</Link>
                }
                <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank">
                    <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                </Link>
            </div>
        </div>
        <hr className="border-grey my-2"/>
    </div>
  )
}

export default BlogInteraction