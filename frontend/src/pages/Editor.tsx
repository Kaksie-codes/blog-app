import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { setBlogContent, setBlogTitle, setBanner, setBlogDescription, setTags } from "../redux/blogpost/blogPostSlice";

// import Cookies from 'js-cookie'

const Editor = () => {
  const { blog_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const { editorMode } = useSelector((state:any) => state.blogPost);
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state:any) => state.user);
  const accessToken = currentUser ? currentUser.accessToken : null;

  useEffect(() => {
    if(!blog_id){
      return setIsLoading(false);
    }
    fetchBlogPost();
  },[]) 

  const fetchBlogPost = async() => {
    try{
        const res = await fetch('/api/post/get-blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({blog_id, draft:true, mode: 'edit'})
        })
        const { blogPost } = await res.json();
        console.log('blogPost', blogPost.content);
        // dispatch(setBlogContent(blogPost.content[0]));
        setIsLoading(false);
        if(blogPost != null){                
            setBlog(blogPost);
          const { content, title, banner, description, tags } = blogPost;
          dispatch(setBlogContent(content[0]));
          dispatch(setBanner(banner));
          dispatch(setBlogTitle(title));
          dispatch(setBlogDescription(description));
          dispatch(setTags(tags))
            setIsLoading(false)                           
        }
        // console.log('blogPost', blogPost);
    }catch(error){ 
        console.log(error);            
    }
}


  return (
    <>
    {
      !accessToken ? (
        <Navigate to={'/signin'}/>
      ) : (
        isLoading ? (
          <Loader/>
        ) : (
          editorMode === 'editor' ? (
            <BlogEditor/>
          ) : (
            <PublishForm/>
          )
        )
       
      )
    }      
    </>
  )
}

export default Editor