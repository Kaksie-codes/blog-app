import { useEffect, useState } from "react"
import InpageNavigation from "../components/InpageNavigation"
import AnimationWrapper from "../libs/page-animation"
import Loader from "../components/Loader";
import BlogPost from "../components/BlogPost";


const Home = () => {
  const [ latestBlogs, setLatestBlogs] = useState(null);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async() => {
    try{
      const res = await fetch(`/api/post/latest-blogs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },        
      });
      const {data} = await res.json();
      setLatestBlogs(data);  
      console.log(data);
          
    }catch(error){
      console.log('error', error)
    }
  }

  return (
    <AnimationWrapper>
      <section className="h-cover flex gap-10 justify-center">
        <div className="w-full">
          <InpageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
            <>
              {
                latestBlogs == null ? (
                  <Loader/>
                ) : (
                  latestBlogs.map((blog: any, index: number) => {
                    return (
                    <AnimationWrapper key={index} transition={{duration: 1, delay: index*0.1}} >
                      <BlogPost content={blog}/>
                    </AnimationWrapper>
                    )
                  })                  
                )
              }
            </>
             
          </InpageNavigation>
        </div>
        <div>

        </div>
      </section>      
    </AnimationWrapper>
  )
}

export default Home