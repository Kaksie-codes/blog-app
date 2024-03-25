import { useEffect, useRef, useState } from "react";
import InpageNavigation from "../components/InpageNavigation";
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import MinimalBlogCard from "../components/MinimalBlogCard";
import BlogCard from "../components/BlogCard";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";

interface Blog {
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  author: {
    personal_info: {
      fullname: string;
      profile_img: string;
      username: string;
    };
  };
  banner?: string;
  blog_id: string;
  description?: string;
  publishedAt: string;
  tags?: string[];
  title: string;
}

export interface BlogApiResponse {
  results: Blog[];
  currentPage: number;
  totalBlogs: number;
  totalPages: number;
}


const Home = () => {
  const [blogs, setBlogs] = useState<BlogApiResponse | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[] | null>(null);
  const [pageState, setPageState] = useState('home');
  const activeTabRef = useRef<HTMLButtonElement>(null);
  

  let categories = [
    'programming',
    'relationship',
    'Tech',
    // 'Social Media',
    // 'Cooking',
    // 'Finance',
    // 'Cryptocurrencies',
    // 'travel',
    // 'love'
  ];

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

  const fetchLatestBlogs = async (page:number = 1) => {
    try {      
      const res = await fetch(`/api/post/latest-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page })
      });
      const { results, currentPage, totalBlogs, totalPages } = await res.json();      
      setBlogs({ results, currentPage, totalBlogs, totalPages });
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

  const fetchBlogsbyCategory = async () => {
    try {
      const res = await fetch(`/api/post/search-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "tag": pageState
        })
      });
      const { data } = await res.json();
      setBlogs(data);
      console.log('pageState', pageState);
      console.log('catBlog >>', data);
    } catch (error) {
      console.log('error', error);
    }
  };
  const getBlogsbyCategory = (e: any) => {
    let category = e.target.textContent.toLowerCase();
    setBlogs(null);
    // Toggle the pageState if the same category is clicked again
    if (pageState === category) {
      setPageState("home");
    } else {
      setPageState(category);
    }
  };
  console.log('blogs >>>', blogs)
  return (
    <AnimationWrapper>
      <section className="h-cover flex gap-10 justify-center">
        <div className="w-full">
          <InpageNavigation activeTabRef={activeTabRef} routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
            <div className="max-w-[700px]">
              {blogs == null ? (
                <Loader />
              ) : (
                <>
                  {blogs.results.length ? (
                    blogs.results.map((blog: any, index: number) => (
                      <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                        <BlogCard content={blog} />
                      </AnimationWrapper>
                    ))
                  ) : (
                    <Nodata message={`No results found for ${pageState}`} />
                  )}
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

        <div className="fixed pt-[80px] top-0 h-screen md:block hidden max-w-min  right-[5vw] md:right-[7vw] lg:right-[10vw]">
          <div className="min-w-[40%] lg:min-w-[400px] rounded-xl  pt-2 border pl-8 mt-8  border-grey">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-medium mb-8 text-xl">Stories from all interests</h1>
                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, index) => (
                    <button
                      className={`tag ${pageState === category.toLowerCase() ? 'bg-black text-white' : ''}`}
                      onClick={(e) => getBlogsbyCategory(e)}
                      key={index}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="font-medium mb-8 text-xl">
                  Trending
                  <i className="fi fi-rr-arrow-trend-up"></i>
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
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
