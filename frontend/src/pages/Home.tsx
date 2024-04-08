import { useEffect, useRef, useState } from "react";
import InpageNavigation from "../components/InpageNavigation";
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import MinimalBlogCard from "../components/MinimalBlogCard";
import BlogCard from "../components/BlogCard";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";

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
  };
  banner: string;
  slug: string;
  description: string;
  content: string
  publishedAt: string;
  tags: string[];
  title: string;
  _id:string
}

export interface BlogApiResponse {
  data: Blog[];
  currentPage: number;
  totalBlogs: number;
  totalPages: number;
}


const Home = () => {
  const [blogs, setBlogs] = useState<BlogApiResponse | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[] | null>(null);
  const [pageState, setPageState] = useState('home');
  const [blogCategories, setBlogCategories] = useState<string[]>(['']);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  

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
  }, [blogCategories])

  const fetchLatestBlogs = async (page:number = 1) => {
    try {      
      const res = await fetch(`/api/post/latest-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page })
      });
      const { data, currentPage, totalBlogs, totalPages } = await res.json();      
      setBlogs({ data, currentPage, totalBlogs, totalPages });
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
      const { data, currentPage, totalBlogs, totalPages }  = await res.json();
      setBlogs({ data, currentPage, totalBlogs, totalPages });
      // console.log('pageState', pageState);
      // console.log('catBlog >>', data);
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
  // console.log('blogs >>>', blogs)
  return (
    <AnimationWrapper>
      <section className="h-cover container xl:px-[5vw] pb-4 flex justify-center">
        <div className=" flex-1 border-grey md:border-r">
          <InpageNavigation 
            activeTabRef={activeTabRef} 
            routes={[pageState, "trending blogs"]} 
            defaultHidden={["trending blogs"]}
          >
            <div className="w-full pr-8">
              {
                blogs == null ? (
                  <Loader />
                ) : (
                <>
                  {
                    blogs && blogs.data.length ? (
                      blogs.data.map((blog: any, index: number) => (
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
              <LoadMore state={blogs} fetchDataFunction={fetchLatestBlogs}/>
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
                <div className="bg-grey rounded-lg p-4">
                  <h1 className="font-bold mb-4 text-2xl">Stories from all interests</h1>
                  <div className="flex gap-3 ">
                    {
                      blogCategories.map((category, index) => (
                        <button
                        className={`tag ${pageState === category.toLowerCase() ? 'bg-black text-white' : 'bg-white text-dark-grey '}`}
                        onClick={(e) => setMode(e)}
                        key={index}
                      >
                        {category}
                      </button>
                      ))
                    }                   
                  </div>                
                </div>
              </div>
              <div className="border border-grey pb-4 rounded-lg bg-grey"> 
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
