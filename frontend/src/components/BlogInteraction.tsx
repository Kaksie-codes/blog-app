import { Link } from "react-router-dom";
import { Blog } from "../pages/Home"
import { useSelector } from "react-redux";


const BlogInteraction = ({
    handleLike, 
    likesCount,
    isLikedByUser,
    blog,   
    setCommentsWrapper,
    totalComments
    } : {  
    handleLike: any,
    likesCount: number, 
    isLikedByUser : boolean,
    blog:Blog,    
    setCommentsWrapper:any   ,
    totalComments: number
}) => {    
    
    let { title, slug } = blog;
    let { author : {personal_info: { username: author_username }}} = blog;    
    const { userInfo } = useSelector((state: any) => state.auth);
    const username = userInfo ? userInfo.username : '';  

    const handleCommentButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the event from propagating to the document level
        e.stopPropagation();
        // Open the comments container
        setCommentsWrapper((prevVal:boolean)=> !prevVal);
    };
    
  return (
    <div>        
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
                        className="Comment__toggle w-10 h-10 flex relative z-10 items-center rounded-full justify-center bg-grey/80"
                        onClick={handleCommentButtonClick}>
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p>{totalComments}</p>
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