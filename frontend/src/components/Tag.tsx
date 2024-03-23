

const Tag = ({tag, tagIndex, tags, blogPost, setBlogPost}: {tag: string, tags: string[], tagIndex:number, blogPost: any, setBlogPost: any}) => {

  const handleTaskDelete = () => {
    const updatedTags = tags.filter(currentTag => currentTag !== tag);      
    setBlogPost({...blogPost, tags: updatedTags});      
  }

  const handleTagEdit = (e:any) => {
    if(e.keyCode === 13 || e.keyCode === 188){
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlogPost({...blogPost, tags})
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