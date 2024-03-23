import AnimationWrapper from "../libs/page-animation"
import { useState } from "react"
import { BlogPost } from "../pages/Editor"
import EditorNavbar from "./EditorNavbar";
import UploadBanner from "./UploadBanner"
import generateSlug from "../libs/generateSlug";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import BlogViewer from "./BlogViewer";
import { Toaster } from "react-hot-toast";


const BlogEditor = ({
    setEditorState, 
    editorState, 
    blogPost, 
    setBlogPost
  } : {
    setEditorState: any,
    editorState: string,
    blogPost: BlogPost,
    setBlogPost: any
  }) => {
    const { title, banner, description, author, tags, content } = blogPost; 
    const [formData, setFormData] = useState({image: ''});
    const [slug, SetSlug] = useState('');
    const [contentVal, setContentVal] = useState('')
    
    const handleTitleKeyDown = (e:any) => {
        console.log(e);
        if(e.keyCode === 13){
            e.preventDefault();
        }
    }

    const handleTitleChange = (e:any) => {
        let input = e.target;
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px';
        setBlogPost({...blogPost, title: input.value});
        const autoSlug = generateSlug(input.value);
        SetSlug(autoSlug);
    }

  return (
    <>
        <EditorNavbar blogPost={blogPost} setEditorState={setEditorState}/>
        <AnimationWrapper>
            <section className="grid grid-cols-2 gap-6">
                <form>
                    <Toaster/>
                    <UploadBanner
                        banner={banner}
                        formData={formData}
                        setFormData={setFormData}
                        blogPost={blogPost}
                        setBlogPost={setBlogPost}
                    />
                    <textarea
                        placeholder="Blog Title"
                        className="text-4xl font-medium resize-none w-full h-20 outline-none mt-10 leading-tight placeholder:opacity-40"
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleTitleChange}
                        name="" id=""></textarea>
                    <hr className="w-full opacity-10 my-5"/>
                        <div id="textEdito" className="font-gelasio mb-12 h-72">
                            <ReactQuill theme="snow" className="h-72 bg-grey mb-12;" placeholder="Write your blog content..." value={contentVal} onChange={setContentVal}/>
                        </div>
                </form>
                <BlogViewer/>
            </section>
        </AnimationWrapper>
    </>
  ) 
}

export default BlogEditor
