import { Link } from "react-router-dom";
import { Blog } from "../pages/Home"


const ManageDraftBlogCard = ({
    blog,
    index ,
    deleteBlog
  } : {
    blog: Blog,
    index: number,
    deleteBlog: any
}) => {
    let { description, slug } = blog;

  return (
    <div className="flex gap-5 lg:gap-10 border-b mb-6 border-grey pb-6">
        <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
            {index < 10 ? "0" + index : index}
        </h1>
        <div>
            <p className="line-clamp-2 font-gelasio">
                {description && description.length ? description : "No Description"}
            </p>
            <div className="flex gap-6 mt-3">
                <Link
                    to={`/editor/${slug}`}
                    className="pr-4 py-2 underline"
                >
                    Edit
                </Link>
                <button 
                    className="pr-4 py-2 underline text-red"
                    onClick={() => deleteBlog(slug)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
  )
}

export default ManageDraftBlogCard