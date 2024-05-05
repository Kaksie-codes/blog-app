import { useEffect, useRef, useState } from "react"
import { Blog, PaginationStats } from "./Home";
import InpageNavigation from "../components/InpageNavigation";
import Loader from "../components/Loader";
import Nodata from "../components/Nodata";
import AnimationWrapper from "../libs/page-animation";
import ManagePublishedBlogCard from "../components/ManagePublishedBlogCard";

interface GetBlogParams {page:number, draft:boolean, deletedDocCount?: number}

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blogStats, setBlogStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})
  const [drafts, setDrafts] = useState<null | boolean>(null);
  const [query, setQuery] = useState("");
  const activeTabRef = useRef<HTMLButtonElement>(null);

  console.log('blogs in mangeBlogs', blogs)
  console.log('blogStats in mangeBlogs', blogStats)
  console.log('drafts in mangeBlogs', drafts)

  const getBlogs = async ({page, draft, deletedDocCount = 0}: GetBlogParams) => {
    try {      
      const res = await fetch(`/api/post/myBlogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, draft, query, deletedDocCount })
      });
      const { data, currentPage, totalCount, totalPages } = await res.json();  
      if(draft){
        setDrafts(data);
      }else{
        if (blogs && blogs.length > 0) {
          // Concatenate new data with existing blogs
          setBlogs([...blogs, ...data]);
        } else {
          // Set the fetched blogs directly
          setBlogs(data);
        }
      }  
      
      setBlogStats({currentPage, totalCount, totalPages})
    } catch (error) {
      console.log('error', error);
    }
  }

  const handleChange = (e:any) => {
    if(!e.target.value.length){
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  }

  const handleSearch = (e:any) => {
    let searchQuery = e.target.value;

    setQuery(searchQuery);

    if(e.keyCode == 13 && searchQuery.length){
       setBlogs(null);
       setDrafts(null);
    }
  }

  useEffect(() => {

    if(blogs === null){
      getBlogs({page: 1, draft:false})
    }

    if(drafts === null){
      getBlogs({page: 1, draft:true})
    }

  }, [blogs, drafts, query])

  return (
    <div>
      <h1 className="max-md:hidden">Manage Blogs</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input 
          type="search" 
          onChange={handleChange}
          onKeyDown={handleSearch}
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
        />
        <i className="fi fi-rr-search absolute right-[10%] top-1/2 md:left-5 md:pointer-events-none -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>
      <InpageNavigation 
        routes={["Published Blogs", "Drafts"]} 
        defaultHidden={["Drafts"]}
        activeTabRef={activeTabRef}
      >
        {
          blogs === null ? (
            <Loader/>
          ) : (
            blogs.length ? (
              	blogs.map((blog, index) => {
                  return (
                    <AnimationWrapper key={index} transition={{delay: index * 0.04}}>
                        <ManagePublishedBlogCard blog={blog}/>
                    </AnimationWrapper> 
                  )
                })
            ) : (
              <Nodata message="No Published blogs"/>
            )
          )
        }
        <h1>This is Draft Blogs</h1>
      </InpageNavigation>
    </div>
  )
}

export default ManageBlogs