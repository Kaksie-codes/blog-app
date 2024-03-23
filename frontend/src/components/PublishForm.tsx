import AnimationWrapper from "../libs/page-animation"
import { BlogPost } from "../pages/Editor"
import { Toaster, toast } from "react-hot-toast"
import Tag from "./Tag"


const PublishForm = ({
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
  let characterLimit = 200;
  let tagsLimit = 10;
  const descriptionCharactersLeft = characterLimit - description.length;
  // const tagsArray: string[] = []

  const handleKeyDown = (e:any) => {
    console.log(e);
    if(e.keyCode === 13){
        e.preventDefault();
    }
  }
  const createTag = (e: any) => {
    if(e.keyCode === 13 || e.keyCode === 188){
      e.preventDefault();
      let tag = e.target.value;
      if(tags.length < tagsLimit){
        if(!tags.includes(tag) && tag.length){
          setBlogPost({...blogPost, tags: [...tags, tag]});
        }        
      }else{
        return toast.error(`You can add max ${tagsLimit} tags`);
      }      
      e.target.value = "";
    }    
  }

  const handlePreviewClose = () => {
    setEditorState('editor');
  }
  return (
    <AnimationWrapper>
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster/>
          <button 
            onClick={handlePreviewClose}
            className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]">
            <i className="fi fi-br-cross"></i>
          </button>
          <div className="center max-w-[550px]">
            <p className="text-dark-grey mb-1">Preview</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} alt="banner image" />
            </div>
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
              onChange={(e) => setBlogPost({...blogPost, title: e.target.value})}
              />
            <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
            <textarea 
              maxLength={characterLimit}
              defaultValue={description}
              placeholder="Blog description"
              className="resize-none h-40 input-box pl-4 leading-7"
              onKeyDown={handleKeyDown}
              onChange={(e) => setBlogPost({...blogPost, description: e.target.value})}

            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {descriptionCharactersLeft} {descriptionCharactersLeft > 1 ? 'Characters' : 'Character'} left
            </p>
            <p className="text-dark-grey mb-2 mt-9">
              Topics - (helps in searching and ranking your blog post)
            </p>
            <div className="relative input-box pl-2 py-2 pb-4 ">
              <input 
                // onChange={}
                onKeyDown={createTag}
                type="text"
                className="sticky input-box bg-white top-0 left-0 w-full pl-4 mb-3 focus:bg-white"
                placeholder="Topic" />
                 {
                  tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <Tag key={index} tag={tag} />
                      ))
                    ) : (
                      <p>No tags available</p>
                  )
                }              
            </div>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {tags.length === tagsLimit ? `You can add max ${tagsLimit} tags` : ''}
            </p>
          </div>
        </section>
    </AnimationWrapper>
  )
}

export default PublishForm