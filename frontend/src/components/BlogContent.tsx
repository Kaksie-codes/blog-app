import parse from 'html-react-parser'

const BlogContent = ({content}:{content:string[]}) => {
  return (
    <div className='blog-content'>
        {/* <p>{content}</p> */}
        {
            content ? (
                parse(content[0])
            ) : (
                null
            )
        }
    </div>
  )
}

export default BlogContent