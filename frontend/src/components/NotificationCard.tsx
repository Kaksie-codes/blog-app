import { Link } from "react-router-dom";
import { Notification } from "../pages/Notifications";
import { getTime } from "../libs/date";
import { useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { useSelector } from "react-redux";


const NotificationCard = ({
    data, 
    index, 
    // notificationState,    
    handleDelete
} : {
    data: Notification,
    index: number,
    // notificationState: any,
    handleDelete: (index:number, notificationId:string) => void, 
}) => {
    const { userInfo: { profile_img: author_profile_img} } = useSelector((state:any) => state.auth);
    let [isReplying, setIsReplying] = useState(false);
    let {
        user: {personal_info: {profile_img, fullname, username}}, 
        createdAt, 
        comment, 
        seen,
        replied_on_comment, 
        type, 
        _id: notificationId,
        blogPost: {slug, title, _id:blogId, author}} = data;

    const handleReplyClick = () => {
        setIsReplying(!isReplying);

    }

    // console.log('notifications ====>>', data)

    if(type === 'like'){
        return (
            <div className={`p-6 border-b border-grey border-l-black ${!seen ? 'border-l-2' : ''}`}>
                <div className="flex gap-5 mb-3">
                    <img src={profile_img} alt="profile image" className="w-14 h-14 rounded-full flex-none" />
                    <div className="w-full">
                        <h1 className="font-medium text-xl text-dark-grey">
                            <span className="lg:inline-block hidden capitalize">{fullname}</span>
                            <Link to={`/users/${username}`} className="mx-1 text-black underline">
                                @{username}
                            </Link>
                            <span className="font-normal">
                                {
                                    !comment ?  'liked your blog' : `liked your comment`
                                }
                            </span>
                        </h1>                                                  
                            {
                                !comment ? (
                                    <Link
                                        to={`/blogs/${slug}`}
                                        className="font-medium text-dark-grey hover:underline line-clamp-1"
                                    >
                                        {`"${title}"`}
                                    </Link>
                                    ) : (
                                    <span>
                                        {`"${comment.comment}"`}
                                    </span>
                                )
                            }                              
                    </div>
                </div>            
                <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                    <p>{getTime(createdAt)}</p>
                    <button 
                        className="underline hover:text-black"
                        onClick={() => handleDelete(index, notificationId)}
                    >
                        Delete
                    </button>                
                </div>
            </div>
        )
    }

    if(type === 'reply'){
        return (
            <div className={`p-6 border-b border-grey border-l-black ${!seen ? 'border-l-2' : ''}`}>
                <div className="flex gap-5 mb-3">
                    <img src={profile_img} alt="profile image" className="w-14 h-14 rounded-full flex-none" />
                    <div className="w-full">
                        <h1 className="font-medium text-xl text-dark-grey">
                            <span className="lg:inline-block hidden capitalize">{fullname}</span>
                            <Link to={`/users/${username}`} className="mx-1 text-black underline">
                                @{username}
                            </Link>
                            <span className="font-normal">
                                {
                                    "replied to your comment"
                                }
                            </span>
                        </h1>                        
                        <div className="p-4 mt-4 rounded-md bg-grey flex items-center gap-4">
                            <img 
                                src={author_profile_img} 
                                alt="author profile image" 
                                className="h-8 w-8 rounded-full"
                            />
                            {replied_on_comment?.comment}
                        </div>
                    </div>
                </div>
                <p className="font-gelasio text-xl my-5 pl-5 ml-14">
                    {comment.comment}
                </p>
                <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                    <p>{getTime(createdAt)}</p>            
                    <>
                        <button 
                            className="underline hover:text-black"
                            onClick={handleReplyClick}
                        >
                            Reply
                        </button>
                        <button 
                            className="underline hover:text-black"
                            onClick={() => handleDelete(index, notificationId)}
                        >
                            Delete
                        </button>
                    </>               
                </div>
                {
                isReplying ? (
                    <div className="pl-10 mt-8 gap-5 flex items-start w-full">
                        <img 
                            src={author_profile_img} 
                            alt="author profile image" 
                            className="h-12 w-12 rounded-full"
                        />
                        <div className="flex-1"> 
                            <NotificationCommentField
                                blogId={blogId}
                                blog_author={author}
                                replyingTo={comment._id}
                                setReplying={setIsReplying}
                            />
                        </div>
                    </div>
                    ) : (
                        null
                    ) 
                }              
            </div>
        )
    }

    if(type === 'comment'){
        return (
            <div className={`p-6 border-b border-grey border-l-black ${!seen ? 'border-l-2' : ''}`}>
                <div className="flex gap-5 mb-3">
                    <img src={profile_img} alt="profile image" className="w-14 h-14 rounded-full flex-none" />
                    <div className="w-full">
                        <h1 className="font-medium text-xl text-dark-grey">
                            <span className="lg:inline-block hidden capitalize">{fullname}</span>
                            <Link to={`/users/${username}`} className="mx-1 text-black underline">
                                @{username}
                            </Link>
                            <span className="font-normal">
                                {
                                'commented on your blogpost'
                                }
                            </span>
                        </h1>
                        
                        <Link 
                            to={`/blogs/${slug}`}
                            className="font-medium text-dark-grey hover:underline line-clamp-1"
                        >
                            {`"${title}"`}
                        </Link>
                        <div className="p-4 mt-4 rounded-md bg-grey">
                            {comment?.comment}
                        </div>
                    </div>
                </div>
                <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                    <p>{getTime(createdAt)}</p>            
                    <>
                        <button 
                            className="underline hover:text-black"
                            onClick={handleReplyClick}
                        >
                            Reply
                        </button>
                        <button 
                            className="underline hover:text-black"
                            onClick={() => handleDelete(index, notificationId)}
                        >
                            Delete
                        </button>
                    </>               
                </div>
                <div>
                    {
                        isReplying ? (
                            <div className="mt-8">
                                 <NotificationCommentField
                                    blogId={blogId}
                                    blog_author={author}
                                    replyingTo={comment._id}                                    
                                    setReplying={setIsReplying}                                                                      
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
  
}

export default NotificationCard 