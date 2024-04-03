import parse from 'html-react-parser'

const BlogContent = ({content}:{content:string}) => {
  return (
    <div className='blog-content'>        
        {
            content ? (
                parse(content)
            ) : (
                null
            )
        }
    </div>
  )
}

export default BlogContent