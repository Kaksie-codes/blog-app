import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import { useSelector } from "react-redux";

// import Cookies from 'js-cookie'

const Editor = () => {
  const { editorMode } = useSelector((state:any) => state.blogPost);
  
  const { currentUser } = useSelector((state:any) => state.user);
  const accessToken = currentUser ? currentUser.accessToken : null;

  // Get the access token from cookies
  // const accessToken = Cookies.get("access_token");

  // console.log("Access Token:", accessToken);


  
  return (
    <>
    {
      !accessToken ? (
        <Navigate to={'/signin'}/>
      ) : (
        editorMode === 'editor' ? (
          <BlogEditor/>
        ) : (
          <PublishForm/>
        )
      )
    }      
    </>
  )
}

export default Editor