import { useCallback, useEffect, useRef, useState } from "react"
import { Blog, PaginationStats } from "./Home";
import InpageNavigation from "../components/InpageNavigation";
import Loader from "../components/Loader";
import Nodata from "../components/Nodata";
import AnimationWrapper from "../libs/page-animation";
import ManagePublishedBlogCard from "../components/ManagePublishedBlogCard";
import ManageDraftBlogCard from "../components/ManageDraftBlogCard";
import toast from "react-hot-toast";
import LoadMore from "../components/LoadMore";
import { useSearchParams } from "react-router-dom";
 

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blogStats, setBlogStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})
  const [drafts, setDrafts] = useState<Blog[] | null>(null);
  const [query, setQuery] = useState("");
  const activeTabRef = useRef<HTMLButtonElement>(null);
  let activeTab = useSearchParams()[0].get("tab")

  // console.log('blogs in mangeBlogs', blogs)
  // console.log('blogStats in mangeBlogs', blogStats)
  // console.log('drafts in mangeBlogs', drafts)

  const deleteBlog = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/post/delete-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const { success, message } = await res.json();

      if (success === true) {
        toast.success(message);
        // Trigger useEffect when a blog is deleted
        setBlogs(null);
        setDrafts(null);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const getBlogs = async ( page:number, draft:boolean ) => {
    try {
        const res = await fetch(`/api/post/myBlogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, draft, query })
        });
        const { data, currentPage, totalCount, totalPages } = await res.json();
        if (draft) {
            setDrafts(data);
        } else {
            if (blogs && blogs.length > 0) { 
                // Concatenate new data with existing blogs
                setBlogs([...blogs, ...data]);
            } else {
                // Set the fetched blogs directly
                setBlogs(data);
            }
        }

        setBlogStats({ currentPage, totalCount, totalPages })
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
      window.scrollTo(0, 0); 
  }, [blogs, drafts, query, deleteBlog]);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.click();          
    }

    if(blogs === null){
      getBlogs(1, false);
    }

    if(drafts === null){
      getBlogs(1, true);
    }

  }, [blogs, drafts, query, deleteBlog])

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
        // defaultHidden={["Drafts"]}
        defaultActiveIndex={activeTab !== 'draft' ? 0 : 1}
        activeTabRef={activeTabRef}
      >
        <>
          {
            blogs === null ? (
              <Loader/>
            ) : (
              blogs && blogs.length ? (
                  blogs.map((blog, index) => {
                    return (
                      <AnimationWrapper key={index} transition={{delay: index * 0.04}}>
                          <ManagePublishedBlogCard blog={blog} deleteBlog={deleteBlog}/>
                      </AnimationWrapper>
                    )
                  })
              ) : (
                <Nodata message="No Published blogs"/>
              )
            )
          }
          <LoadMore
            fetchBlogsDraft={getBlogs}
            state={blogStats} 
            draft={blogs !== null || drafts === null}
          />
        </>
        {
          drafts === null ? (
            <Loader/>
          ) : (
            drafts && drafts.length ? (
              drafts.map((blog, index) => {
                  return (
                    <AnimationWrapper key={index} transition={{delay: index * 0.04}}>
                        <ManageDraftBlogCard blog={blog} index={index + 1} deleteBlog={deleteBlog}/>
                    </AnimationWrapper> 
                  )
                })
            ) : (
              <Nodata message="No Draft blogs"/>
            )
          )
        }        
      </InpageNavigation>
    </div>
  )
}

export default ManageBlogs