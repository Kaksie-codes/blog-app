import { Link } from "react-router-dom";
import { getDay } from "../libs/date";


const BlogCard = ({ content }:{ content:any }) => {
    const { author, publishedAt, tags, title, description, banner, activity, blog_id:id } = content;
    const {personal_info: {fullname, username, profile_img}} = author;
    const { total_likes } = activity;
  return (
    <Link to={`/blogs/${id}`} className="flex relative items-center gap-8 border-b border-grey pb-5 mb-4">
        <div className="w-full">
            <div className="flex gap-2 mb-7 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full md:w-10 md:h-10 overflow-hidden">
                        <img
                            src={profile_img}
                            alt="profile image"
                            className="w-full h-full object-cover"
                        />
                    </div>                    
                    <div className="flex flex-col gap-0">
                        <p className="line-clamp-1 text-dark-grey font-bold ">{fullname}</p>
                        <p className="line-clamp-1 ">@{username}</p>
                    </div>
                </div>
                <p className="m-w-fit absolute top-1 right-1">{getDay(publishedAt)}</p>
            </div>
            <h1 className="blog-title">{title}</h1>
            <p className="font-gelasio my-3 leading-7 text-xl max-sm:hidden md:max-[1100px]:hidden  line-clamp-2">{description}</p>
            <div className="flex gap-4 mt-7 ">
                <span className="btn-light py-1 px-4">{tags[0]}</span>
                <span className="flex items-center ml-3 text-dark-grey gap-2">
                    <i className="fi fi-rr-heart"></i>
                    {total_likes}
                </span>
            </div>
        </div>
        <div className="h-28 aspect-square bg-grey">
            <img src={banner} alt="banner image" className="w-full h-full aspect-square object-cover" />
        </div>
    </Link>
  )
}
// md:max-w-[1100px]
export default BlogCard