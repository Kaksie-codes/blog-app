import { getDay } from "../libs/date"
import Avatar from "./Avatar"

const CommentCard = ({
  index, 
  leftVal, 
  commentData
} : {
  index:number,
  leftVal: number,
  commentData: any
}) => {
  const {commented_by:{ username }, commentedAt, comment} = commentData
  return (
    <div className="w-full" style={{paddingLeft: `${leftVal}px`}}>
      <div className="my-5 p-6 rounded-md border-grey border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3 items-center">
            <Avatar profileImg="" parentStyles="h-6 w-6" fullname="" username={username}/>
            <p className="line-clamp-1">{username}</p>
          </div>
          <p className="min-w-fit">{getDay(commentedAt)}</p>          
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>
      </div>
    </div>
  )
}

export default CommentCard