import { Link } from "react-router-dom";
import { getDay } from "../libs/date";
import Avatar from "./Avatar";


const MinimalBlogCard = ({
  content, 
  index
} : {
  content:any, 
  index:number
}) => {
    const { author, publishedAt,  title, slug } = content;
    const {personal_info: {fullname, username, profile_img}} = author;

  return (
    <Link to={`/blogs/${slug}`} className="flex gap-5 py-4 w-full hover:bg-yellow-50 px-4">
        <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-dark-grey leading-none">{index < 10 ? `0${index}` : index}</h1>
        <div className="w-full">
        <div className="flex gap-2 flex-1  mb-2 items-center relative">
              <Avatar
                profileImg={profile_img}
                username={username}
                fullname={fullname} 
                parentStyles="w-10 h-10 rounded-full "
              />                
                <p className="line-clamp-1 text-sm flex-1">
                  {/* {fullname} */}
                   @{username}
                </p>
                {/* <p className="m-w-fit">{getDay(publishedAt)}</p> */}
                <p className="text-sm whitespace-nowrap">{getDay(publishedAt)}</p>
          </div>
          <h1 className="sm:line-clamp-2 text-xl font-bold leading-7 line-clamp-3 ">{title}</h1>
        </div>
    </Link>
  )
}

export default MinimalBlogCard