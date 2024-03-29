import AnimationWrapper from "../libs/page-animation"
import { Toaster, toast } from "react-hot-toast"
import Tag from "./Tag"
import { useDispatch, useSelector } from "react-redux";
import { setBlogTitle, setEditorMode, setBlogDescription, setTags, setBanner, setBlogContent } from "../redux/blogpost/blogPostSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";


const PublishForm = () => {
  const { blog_id } = useParams();
  const { title, content, banner, tags, description, draft } = useSelector((state: any) => state.blogPost) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
   
  let characterLimit = 200;
  let tagsLimit = 10;
  const descriptionCharactersLeft = characterLimit - description.length;
  const tagsLeft = tagsLimit - tags.length;


  const handleKeyDown = (e:any) => {    
    if(e.keyCode === 13){
        e.preventDefault();
    }    
  }
  
  const createTag = (e: any) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
        e.preventDefault();
        let tag = e.target.value.trim(); // Trim to remove leading/trailing whitespaces
        if (tags.length < tagsLimit) {
            if (!tags.includes(tag) && tag.length) {
                const newTagsArray = [...tags, tag]; // Append the new tag to the existing tags array
                dispatch(setTags(newTagsArray));
            }
        } else {
            return toast.error(`You can add max ${tagsLimit} tags`);
        }
        e.target.value = "";
    }
}

  const publishBlogPost = async (e:any) => {
    e.preventDefault(); 
    let loading;
    try{ 
      if(!title.length){
        setDisabled(false);
        return toast.error('Write Blog title before publishing')
      }    
  
      if(!description.length || description.length > characterLimit){
        setDisabled(false);
        return toast.error(`Write a description about your blog within ${characterLimit} characters to be published`)
      }
      if(!tags.length){
        setDisabled(false);
        return toast.error('Enter at least 1 tag to help us rank your blog')
      }

      setDisabled(true);      

      let blogObject = {
        draft,
        title,
        banner,
        description,
        content,
        tags
      }
      
      // loading = toast.loading('Publishing...');    
      if(banner.length){
        const res = await fetch(`/api/post/create-post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({...blogObject, id: blog_id}),
      });

      const data = await res.json();
      toast.success('Post Published Successfully'); 
      console.log(data);      
      toast.dismiss(loading);          
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
      }
              
  }catch(err){ 
      console.log('error >>', err);
      setDisabled(false);
      return toast.error('Sorry, Could not publish blog post'); 
  }
}

  const handlePreviewClose = () => {
    dispatch(setEditorMode('editor'));    
  }
  
  return (
    <AnimationWrapper>
        <section className="container xl:px-[5vw] w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster/>
          <button 
            onClick={handlePreviewClose}
            className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]">
            <i className="fi fi-br-cross"></i>
          </button>
          <div className="center max-w-[550px]">
            <p className="text-dark-grey mb-1">Preview</p>
            {
              banner &&  <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} alt="banner image" />
            </div>
            }
           
            <h1 className="text-4xl leading-tight line-clamp-2 mt-2 font-medium">{title}</h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{description}</p>
          </div>          
          <div className="border-grey lg:border-1 lg:pl-8 ">
            <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
            <input 
              type="text" 
              className="input-box pl-4 "
              placeholder="Blog Title"
              defaultValue={title}
              onChange={(e) => dispatch(setBlogTitle(e.target.value))}
              />
            <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
            <textarea 
              maxLength={characterLimit}
              defaultValue={description}
              placeholder="Blog description"
              className="resize-none h-40 input-box pl-4 leading-7"
              onKeyDown={handleKeyDown}
              onChange={(e) => dispatch(setBlogDescription(e.target.value))}

            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {descriptionCharactersLeft} {descriptionCharactersLeft > 1 ? 'Characters' : 'Character'} left
            </p>
            <p className="text-dark-grey mb-2 mt-9">
              Topics - (helps in searching and ranking your blog post)
            </p>
            <div className="relative input-box pl-2 py-2 pb-4 ">
              <input                
                onKeyDown={createTag}
                type="text"
                className="sticky input-box bg-white top-0 left-0 w-full pl-4 mb-3 focus:bg-white"
                placeholder="Topic" />
                 {
                  tags.length > 0 ? (
                    tags.map((tag:string, index:number) => (
                      <Tag 
                        key={index} 
                        tag={tag}                        
                        tagIndex={index}                        
                      />
                      ))
                    ) : (
                      <p>No tags available</p>
                  )
                }                          
            </div>
            <p className="mt-1 mb-4 text-dark-grey text-sm text-right">
              {tagsLeft} {tagsLeft > 1 ? 'tags' : 'tag'} left
            </p> 
            <button 
              disabled={disabled}
              onClick={publishBlogPost}
              className={`btn-dark px-8 ${disabled ? 'cursor-not-allowed' : ''}`}>
                {disabled ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </section>
    </AnimationWrapper>
  )
}

export default PublishForm