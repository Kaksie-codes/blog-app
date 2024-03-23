import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

export interface Author{
  personal_info: {        
      profile_img?: string;
      username?: string;
      fullname?: string;
  }
  
}

export interface BlogPost{
  title: string, 
  banner:string, 
  content: any[], 
  tags: string[], 
  description: string,
  author: Author
}

const Editor = () => {
  const { currentUser } = useSelector((state:any) => state.user);
  const accessToken = currentUser ? currentUser.accessToken : null;
  const [editorState, setEditorState] = useState<string>('editor');
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '', 
    banner:'', 
    content: [], 
    tags: [], 
    description: '',
    author: {
      personal_info: {}
    }
  }) 
  
  return (
    <>
    {
      !accessToken ? (
        <Navigate to={'/signin'}/>
      ) : (
        editorState === 'editor' ? (
          <BlogEditor editorState={editorState} setEditorState={setEditorState} blogPost={blogPost} setBlogPost={setBlogPost}/>
        ) : (
          <PublishForm editorState={editorState} setEditorState={setEditorState} blogPost={blogPost} setBlogPost={setBlogPost}/>
        )
      )
    }      
    </>
  )
}

export default Editor