

const BlogPost = ({ content }:{ content:any }) => {
    const { author, publishedAt, tags, title, description, banner, activity, blog_id:id } = content;
    const {personal_info: {fullname, username, profile_img}} = author;
    const { total_likes } = activity;
  return (
    <div className="w-full">
        <div className="flex gap-2 mb-7 items-center">
            <img 
                src={profile_img}
                 alt="profile image"
                 className="w-6 h-6 rounded-full "
            />
            <p className="line-clamp-1 ">
                {fullname} @{username}
            </p>
        </div>
    </div>
  )
}

export default BlogPost