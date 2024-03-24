import { useDispatch, useSelector } from "react-redux";
import { setTags } from "../redux/blogpost/blogPostSlice";


const Tag = ({
  tag, 
  tagIndex,
} : {
  tag: string,
  tagIndex:number, 
}) => {
  const { tags } = useSelector((state: any) => state.blogPost) || {};
  const dispatch = useDispatch();

  const handleTaskDelete = () => {
    const updatedTags = tags.filter((currentTag:string) => currentTag !== tag);
    dispatch(setTags(updatedTags)); 
  }

  const handleTagEdit = (e: any) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      const updatedTags = [...tags]; // Create a copy of the tags array
      updatedTags[tagIndex] = currentTag; // Update the specific tag
      dispatch(setTags(updatedTags)); // Dispatch the action with the updated tags
      e.target.setAttribute('contentEditable', false);
    }
  }
  

  const addEditable = (e:any) => {
    e.target.setAttribute('contentEditable', true);
    e.target.focus();
  }


  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p 
        className="outline-none" 
        onKeyDown={handleTagEdit}
        onClick={addEditable}>
        {tag}
      </p>
      <button onClick={handleTaskDelete}
      className="mt-[2px] rounded-full right-3 absolute top-1/2 -translate-y-1/2">
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  )
}

export default Tag