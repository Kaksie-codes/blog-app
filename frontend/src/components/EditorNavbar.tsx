import { Link, useParams } from "react-router-dom"
import logo from '../imgs/logo.png'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setBanner, setBlogContent, setBlogDescription, setBlogTitle, setEditorMode, setTags } from "../redux/blogpost/blogPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";


const EditorNavbar = () => {
    const { slug } = useParams();
    const { title, content, banner, tags, description  } = useSelector((state: any) => state.blogPost) || {}; 
    const dispatch = useDispatch(); 
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const handlePublish = () => {
        //validate form
        if(!banner){
            // return alert('Upload a blog banner to publish it')
            return toast.error('Upload a blog banner to publish it')
        }

        if(!title.length){
            // return alert('Upload a blog banner to publish it')
            return toast.error('Write a blog title to publish it')
        }

        if(!content.length){
            // return alert('Upload a blog banner to publish it')
            return toast.error('Write something in your blog to publish it')
        }
        dispatch(setEditorMode('publish'));        
    }

    const handleSaveDraft = async (e:any) => {
        e.preventDefault();

        try {
            // if(e.target.className.includes('disable')){
            //     return 
            // }
            if(!title.length){
                return toast.error('Write Blog title before saving it to draft')
            }    
            setDisabled(true);   
            
            let blogObject = {
                draft: true,
                title,
                banner,
                description,
                content,
                tags
            }

            const res = await fetch(`/api/post/create-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...blogObject, slug}),
            })

            const data = await res.json();
            toast.success('Draft saved Successfully'); 

            setTimeout(() => {
                if(data){
                  dispatch(setBanner(''));          
                  dispatch(setBlogDescription('')); 
                  dispatch(setBlogTitle(''));
                  dispatch(setBlogContent(''));
                  dispatch(setTags([]));
                  dispatch(setEditorMode('editor')); 
                  setDisabled(false); 
                }  
                // Navigate after 2 seconds        
                navigate('/');
            }, 3000); 
          
            
            //   e.target.classList.add('disable');
        }catch(error){
            console.log('error >>', error);
            setDisabled(false);
            return toast.error('Sorry, Could not save draft'); 
        }
    }

  return (
    <nav className="z-10 sticky top-0 w-full  py-5 h-[80px] border-b border-grey bg-white">
        <div className="container flex items-center gap-12">
            <Link to={'/'} className='flex items-center justify-center gap-1'>
                <img src={logo} alt="logo"  className='flex-none w-6 lg:w-10'/>
                <p className='font-bold text-xl lg:text-2xl'>enBlogg</p>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full ">
                {title ? `${title}` : "New Blog"}
            </p>
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2" onClick={handlePublish}>
                    Publish
                </button>
                <button className={`btn-light py-2 ${disabled ? 'cursor-not-allowed' : ''}`} onClick={handleSaveDraft}>                    
                    {disabled ? 'Saving Draft...' : 'Save Draft'}
                </button>
            </div>
        </div>
    </nav>
  )
}

export default EditorNavbar