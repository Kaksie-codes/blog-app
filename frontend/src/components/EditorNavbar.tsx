import { Link } from "react-router-dom"
import logo from '../imgs/logo.png'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setEditorMode } from "../redux/blogpost/blogPostSlice";
import { useDispatch, useSelector } from "react-redux";

const EditorNavbar = () => {
    const { title } = useSelector((state: any) => state.blogPost) || {};
    const dispatch = useDispatch(); 
    
    const navigate = useNavigate();

    const handlePublish = () => {
        //validate form
        // if(!banner.length){
        //     // return alert('Upload a blog banner to publish it')
        //     return toast.error('Upload a blog banner to publish it')
        // }

        // if(!title.length){
        //     // return alert('Upload a blog banner to publish it')
        //     return toast.error('Write a blog title to publish it')
        // }

        // if(!description.length){
        //     // return alert('Upload a blog banner to publish it')
        //     return toast.error('Write something in your blog to publish it')
        // }
        dispatch(setEditorMode('publish'));        
    }

    const handleSaveDraft = (e:any) => {
        e.preventDefault();

        if(e.target.className.includes('disable')){
            return 
        }
        if(!title.length){
            return toast.error('Write Blog title before saving it to draft')
        }    

        let loadingToast = toast.loading('Saving draft....')
      navigate('/')
        e.target.classList.add('disable');
    }

  return (
    <nav className="navbar">
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
            <button className="btn-light py-2" onClick={handleSaveDraft}>
                Save Draft
            </button>
        </div>
    </nav>
  )
}

export default EditorNavbar