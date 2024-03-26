import AnimationWrapper from "../libs/page-animation"
import { useState } from "react"
import EditorNavbar from "./EditorNavbar";
import UploadBanner from "./UploadBanner"
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import BlogViewer from "./BlogViewer";
import { Toaster } from "react-hot-toast";
import { setBlogTitle, setBlogContent } from "../redux/blogpost/blogPostSlice";
// import parse from 'html-react-parser'


const BlogEditor = () => {
    const { title, content } = useSelector((state: any) => state.blogPost) || {};
    const dispatch = useDispatch(); 
    
    const handleTitleKeyDown = (e:any) => {        
        if(e.keyCode === 13){
            e.preventDefault();
        }
    }

    

    const handleTitleChange = (e:any) => {
        let input = e.target;
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px';
        dispatch(setBlogTitle(input.value));        
    }
   
 
    // Custom ToolBar
    const modules = {
        toolbar: [
            [{header: [1, 2, false]}],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{list: "ordered"}, {list: "bullet"}],
            ["link", "indent", "color", "image"],
            [{"code-block": true}],
            ["clean"],
        ],
    }

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "Strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "indent",
        "image",
        "code-block",
        "color"
    ]

  return (
    <>
        <EditorNavbar/>
        <AnimationWrapper>
            <section className="container xl:px-[5vw] ">
                <form>
                    <Toaster/>
                    <UploadBanner                       
                    />
                    <textarea
                        placeholder="Blog Title"
                        value={title}
                        className="text-4xl font-medium resize-none w-full h-20 outline-none mt-10 leading-tight placeholder:opacity-40"
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleTitleChange}
                        name="" id=""></textarea>
                    <hr className="w-full opacity-10 my-5"/>                    
                    <div id="textEditor font-gelasio">
                        <ReactQuill
                            theme="snow"
                            className="h-auto  mb-12 overflow-scroll"                            
                            placeholder="Write your blog content..."
                            value={content}                            
                            modules={modules}
                            formats={formats}
                            onChange={(value) => dispatch(setBlogContent(value))}
                        />
                    </div>                    
                </form>
                <BlogViewer/>
            </section>
        </AnimationWrapper>
    </>
  ) 
}

export default BlogEditor
