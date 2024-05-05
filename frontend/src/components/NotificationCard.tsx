import { Link } from "react-router-dom";
import { Notification } from "../pages/Notifications";
import { getTime } from "../libs/date";
import { SyntheticEvent, useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { useSelector } from "react-redux";


const NotificationCard = ({
    data, 
    index, 
    notificationState
} : {
    data: Notification,
    index: number,
    notificationState: any
}) => {
    const { userInfo: {username: author_username, profile_img: author_profile_img} } = useSelector((state:any) => state.auth);
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

    const handleDelete = async (comment_id: string, type: string, event: SyntheticEvent) => {
        const target = event.currentTarget as HTMLButtonElement; 
        // target.setAttribute("disabled", true);
        target.disabled = true;
        try {
            const res = await fetch(`/api/notification/get-notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ })              
            });
            
            // const { data, currentPage, totalCount, totalPages }  = await res.json(); 
        } catch (error) {
            
        }
    }

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
                            type === 'like' ? 'Liked your blog' : 
                            type === 'comment' ? 'commented on' : 
                            "replied"
                        }
                    </span>
                </h1>
                {
                    type === 'reply' ? (
                    <div className="p-4 mt-4 rounded-md bg-grey">
                        {replied_on_comment?.comment}
                    </div>) : (
                        <Link 
                            to={`/blogs/${slug}`}
                            className="font-medium text-dark-grey hover:underline line-clamp-1"
                        >
                            {`"${title}"`}
                        </Link>
                    )
                }
            </div>
        </div>
        {
            type !== 'like' ? (
                <p className="font-gelasio text-xl my-5 pl-5 ml-14">
                    {comment.comment}
                </p>
            ) : (
                ""
            )
        }
        <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
            <p>{getTime(createdAt)}</p>
            {
                type !== 'like' ? (
                    <>
                        <button 
                            className="underline hover:text-black"
                            onClick={handleReplyClick}
                        >
                            Reply
                        </button>
                        <button 
                            className="underline hover:text-black"
                            onClick={(e) => handleDelete(comment._id, "comment", e)}
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    ""
                )
            }
        </div>
        {
            isReplying ? (
                <div className="mt-8">
                    <NotificationCommentField
                        _id={blogId}
                        blog_author={author}
                        replyingTo={comment._id}
                        index={index}
                        setReplying={setIsReplying}
                        notification_id={notificationId}
                        notificationData={notificationState}
                    />
                </div>
            ) : (
                null
            )
        }
        <div className="ml-20 bg-grey mt-5 rounded-md p-4">
            <div className="flex gap-3 mb-3">
                <img 
                    src={author_profile_img} 
                    alt="author profile image"
                    className="w-8 h-8 rounded-full" 
                />
                <div>
                    <h1 className="font-medium text-xl text-dark-grey">
                        <Link 
                            to={`/users/${author_username}`}
                            className="mx-1 text-black underline"
                        >
                            @{author_username}
                        </Link>
                        <span className="font-normal">replied to</span>
                        <Link 
                            to={`/users/${username}`}
                            className="mx-1 text-black underline"
                        >
                            @{username}
                        </Link>
                    </h1>
                </div>
            </div>
            <p className="ml-14 font-gelasio text-xl my-2">{comment.comment}</p>
            <button 
                className="underline hover:text-black ml-14 mt-2"
                onClick={(e) => handleDelete(comment._id, "comment", e)}
            >
                Delete
            </button>
        </div>
    </div>
  )
}

export default NotificationCard