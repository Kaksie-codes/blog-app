import { useEffect, useRef, useState } from "react";
import InpageNavigation from "../components/InpageNavigation";
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import MinimalBlogCard from "../components/MinimalBlogCard";
import BlogCard from "../components/BlogCard";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

export interface Blog {
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
    likes: string[],
  };
  author: {
    personal_info: {
      fullname: string;
      profile_img: string;
      username: string;
    };
    _id: string
  };
  banner: string;
  slug: string;
  description: string;
  content: string
  publishedAt: string;
  tags: string[];
  title: string;
  comments: any;
  _id:string, 
}

export interface PaginationStats {
  currentPage: number, 
  totalCount: number, 
  totalPages: number,
  deletedDocCount?: number
} 

export interface BlogApiResponse {
  data: Blog[];
  currentPage: number;
  totalBlogs: number;
  totalPages: number;  
}


const Home = () => {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blogStats, setBlogStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[] | null>(null);
  const [pageState, setPageState] = useState('home');
  const [blogCategories, setBlogCategories] = useState<string[]>(['']);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const tabsBoxRef = useRef<HTMLDivElement>(null);
  const scrollLeftRef = useRef<HTMLDivElement>(null);
  const scrollRightRef = useRef<HTMLDivElement>(null);  
  const [scrolledEnd, setScrolledEnd] = useState(false)
  const [scrolledStart, setScrolledStart] = useState(true)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Handle arrow key presses
      switch (event.key) {
        case 'ArrowLeft':
          scrollLeft();
          break;
        case 'ArrowRight':
          scrollRight();
          break;
        default:
          break;
      }
    };
    
    // Add event listener for keyboard events
    document.addEventListener('keydown', handleKeyPress);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
 

  const scrollLeft = () => {    
    if(tabsBoxRef.current)
    tabsBoxRef.current.scrollLeft += -350;
    
    // Calculate scroll position and max scrollable width
    let scrollVal = tabsBoxRef.current?.scrollLeft;
    let maxScrollableWidth = tabsBoxRef.current?.scrollWidth;
   
    // Check if we've reached the end of the scrollable content
    if (scrollVal && maxScrollableWidth && maxScrollableWidth > scrollVal) {
        setScrolledEnd(false);  
    }else if(scrollVal === 0){
      // If we've reached the end, hide scrollLeftRef
      setScrolledStart(true);        
  }  
}

const scrollRight = () => {

  // Scroll right by a certain amount
  if(tabsBoxRef.current)
  tabsBoxRef.current.scrollLeft += 350;

  // Wait for a short moment before checking scrollVal
  setTimeout(() => {
    // Calculate scroll position and max scrollable width
    let scrollVal = tabsBoxRef.current?.scrollLeft;
    let maxScrollableWidth = tabsBoxRef.current?.scrollWidth;

    if(scrollVal && tabsBoxRef.current)
    // console.log('total ===>>', scrollVal + tabsBoxRef.current.offsetWidth);

    // Check if we've reached the end of the scrollable content
    if (scrollVal && scrollVal > 0) {
      // If we haven't reached the end, make scrollLeftRef visible
      setScrolledStart(false);  
      setScrolledEnd(false);   
    }

    if(scrollVal && maxScrollableWidth && tabsBoxRef.current && scrollVal + tabsBoxRef.current.offsetWidth >= maxScrollableWidth){
      // If we've reached the end, hide scrollLeftRef
      setScrolledEnd(true);
    }
  }, 300); // Adjust the timeout delay as needed
}



  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.click();
    }
    if (pageState === 'home') {
      fetchLatestBlogs();
    } else {
      fetchBlogsbyCategory();
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchLatestBlogs = async (page:number = 1) => {     
    try {      
      const res = await fetch(`/api/post/latest-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page })
      });
      const { data, currentPage, totalCount, totalPages } = await res.json();      
      if (blogs && blogs.length > 0) {
        // Concatenate new data with existing blogs
        setBlogs([...blogs, ...data]);
      } else {
        // Set the fetched blogs directly
        setBlogs(data);
      }
      setBlogStats({currentPage, totalCount, totalPages})
    } catch (error) {
      console.log('error', error);
    }
  }; 


  const fetchTrendingBlogs = async () => {
    try {
      const res = await fetch(`/api/post/trending-blogs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const { data } = await res.json();
      setTrendingBlogs(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/post/get-categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const { tags } = await res.json();
      setBlogCategories(tags);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchBlogsbyCategory = async () => {    
    try {
      const res = await fetch(`/api/post/search-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "tag": pageState
        })
      });
      const { data, currentPage, totalCount, totalPages }  = await res.json();         
      setBlogs(data);
      setBlogStats({currentPage, totalCount, totalPages}); 
    } catch (error) {
      console.log('error', error);
    }
  };

  const setMode = (e: any) => {
    let category = e.target.textContent.toLowerCase();
    setBlogs(null);
    // Toggle the pageState if the same category is clicked again
    if (pageState === category) {
      setPageState("home");
    } else {
      setPageState(category);
    }
  };
  
  return (
    <AnimationWrapper>
      <section className="h-cover container  xl:px-[5vw] pb-4 flex justify-center">
        <div className=" flex-1 border-grey md:border-r w-full">
          <InpageNavigation 
            activeTabRef={activeTabRef} 
            routes={[pageState, "trending blogs"]} 
            defaultHidden={["trending blogs"]}
          >
            <div className="w-full lg:pr-8">
              {
                blogs == null ? (
                  <Loader />
                ) : (
                <>
                  {
                    blogs && blogs.length ? (
                      blogs.map((blog: any, index: number) => (
                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                          <BlogCard content={blog} />
                        </AnimationWrapper>
                        ))
                    ) : (
                    <Nodata message={`No results found for ${pageState}`} />
                  )
                  }
                </>
              )}
              <LoadMore state={blogStats} fetchDataFunction={fetchLatestBlogs}/>
            </div>
            <>
              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.length ? (
                  trendingBlogs.map((blog: any, index: number) => (
                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                      <MinimalBlogCard content={blog} index={index + 1} />
                    </AnimationWrapper>
                  ))
                ) : (
                  <Nodata message={`No trending blogs found`} />
                )                
              )              
            }
            </>
          </InpageNavigation>
        </div>        
        <div className="p-4 pt-0 md:px-8 w-[40%] hidden 
          max-md:items-center gap-5 md:full  md:pl-8 md:sticky md:block">
            <div className="relative flex flex-col gap-4 w-full h-full">
              <div className="w-full sticky left-0 pb-4  top-[80px] pt-5 bg-white z-20">
                <div className="bg-grey rounded-lg py-4">
                  <h1 className="font-bold mb-4 text-2xl ml-4">Stories from all interests</h1>
                  <div className="flex gap-3 overflow-x-hidden relative bg-transparent overflow-hidden px-2">
                    <div className={`icon absolute top-0 left-0 h-full w-[50px] flex items-center ${scrolledStart ? 'hidden' : 'flex'}`}>
                      <div 
                        ref={scrollLeftRef} 
                        onClick={scrollLeft}
                        className="cursor-pointer rounded-full hover:bg-dark-grey text-black hover:text-white ml-[7px]">
                        <MdOutlineKeyboardArrowLeft size={30}/>
                      </div>
                    </div>
                    <div 
                      className=" flex gap-3 overflow-x-scroll scrollbar scroll-smooth  p-4" 
                      ref={tabsBoxRef}                       
                      // onScroll={handleScroll}                      
                    >
                      {
                        blogCategories.map((category, index) => (
                          <button
                          className={`tag whitespace-nowrap border border-grey ${pageState === category.toLowerCase() ? 'bg-black text-white' : 'bg-white text-dark-grey '}`}
                          onClick={(e) => setMode(e)}
                          key={index}
                        >
                          {category}
                        </button>
                        ))
                      }
                    </div>
                    <div className={`icon absolute top-0 right-0 h-full w-[50px] flex items-center ${scrolledEnd ? 'hidden' : 'flex'}`}>
                      <div 
                        ref={scrollRightRef} 
                        onClick={scrollRight}
                        className="cursor-pointer rounded-full hover:bg-dark-grey  hover:text-white ml-[9px]">
                        <MdOutlineKeyboardArrowRight size={30}/> 
                      </div>
                    </div>             
                  </div>                
                </div>
              </div>
              <div className="border border-grey pb-4 rounded-lg "> 
              <h1 className="py-4 text-2xl px-4 font-bold">
                  Trending
                  <i className="fi fi-rr-arrow-trend-up font-bold"></i>
                </h1>               
                {trendingBlogs == null ? (
                  <Loader />
                ) : (
                  trendingBlogs.length ? (
                    trendingBlogs.map((blog: any, index: number) => (
                      <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                        <MinimalBlogCard content={blog} index={index + 1} />
                      </AnimationWrapper>
                    ))
                  ) : (
                    <Nodata message={`No trending blogs found`} />
                  )
                )
              }
              </div>
            </div>
        </div>      
      </section>
    </AnimationWrapper>
  );
};

export default Home;
