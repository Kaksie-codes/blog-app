import { Link } from "react-router-dom";
import { getDay } from "../libs/date";


const MinimalBlogCard = ({content, index}: {content:any, index:number}) => {
    const { author, publishedAt,  title, blog_id:id } = content;
    const {personal_info: {fullname, username, profile_img}} = author;
  return (
    <Link to={`/blogs/${id}`} className="flex gap-5 mb-8">
        <h1 className="blog-index">{index < 10 ? `0${index}` : index}</h1>
        <div>
        <div className="flex gap-2 mb-7 items-center">
                <img
                    src={profile_img}
                     alt="profile image"
                     className="w-6 h-6 rounded-full "
                />
                <p className="line-clamp-1 ">{fullname} @{username}</p>
                <p className="m-w-fit">{getDay(publishedAt)}</p>
            </div>
            <h1 className="blog-title">{title}</h1>
        </div>
    </Link>
  )
}

export default MinimalBlogCard