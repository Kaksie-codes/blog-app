import { Link } from "react-router-dom";
import { Blog } from "../pages/Home"
import { getTime } from "../libs/date";
import { useState } from "react";
import BlogStats from "./BlogStats";


const ManagePublishedBlogCard = ({
  blog,
  deleteBlog
} : {
  blog: Blog,
  deleteBlog: any
}) => {
  let { banner, slug, title, publishedAt, activity } = blog;
  const [showStat, setShowStat] = useState(false);

  return (
    <div>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img 
          src={banner} 
          alt="blog banner" 
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" 
        />
        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link to={`/blogs/${slug}`} className="blog-title mb-4 hover:underline">
              {title}
            </Link>
            <p className="line-clamp-1">Published {getTime(publishedAt)}</p>
          </div>
          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${slug}`} className="pr-4 py-2 underline">
              Edit
            </Link>
            <button 
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStat(!showStat)}
            >
              Stats
            </button>
            <button 
              className="pr-4 py-2 underline text-red"
              onClick={() => deleteBlog(slug)}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="max-lg:hidden">
          <BlogStats stats={activity}/>
        </div>
      </div>
      {
        showStat ? (
          <div className="lg:hidden">
            <BlogStats stats={activity}/>
          </div>
        ) : (
          null
        )
      }
    </div>
  )
}

export default ManagePublishedBlogCard