import { useState } from "react"

const NotificationCommentField = ({
    _id,
    blog_author,
    index = undefined,
    replyingTo = undefined,
    setReplying,
    notification_id,
    notificationData
} : {
    _id:string,
    blog_author: string,
    index: number,
    replyingTo: string,
    notification_id:string,
    setReplying: any,
    notificationData: any
}) => {
    let [comment, setComment] = useState('');

    let { notifications, notifications: { results }, setNotifications } = notificationData

    const handleComment = () => {

    }

    console.log('results ===>>', results)

  return (
    <>
        <textarea 
            name="" 
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            placeholder="Leave a reply..."
        >            
        </textarea>
        <button className="btn-dark mt-5 px-10" onClick={handleComment}>
            Reply
        </button>
    </>
  )
}

export default NotificationCommentField