import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import AboutUser from "../components/AboutUser";
import InpageNavigation from "../components/InpageNavigation";
import LoadMore from "../components/LoadMore";
import BlogCard from "../components/BlogCard";
import Nodata from "../components/Nodata";
import { Blog, PaginationStats  } from "./Home";
import PageNotFound from "./PageNotFound";


export interface UserProfile {
  account_info:{
    total_posts: number,
    total_reads: number,
  },
  joinedAt:string,
  personal_info: {
    fullname: string;
    profile_img: string;
    username: string;
    bio:string;
    email?: string;
  };
  social_links:{
    youtube:string,
    instagram:string,
    facebook:string,
    twitter:string,
    github:string,
    website:string,
  },
  _id:string
}

export const userProfile = {
  account_info:{
    total_posts: 0,
    total_reads: 0,
  },
  joinedAt: '',
  personal_info: {
    fullname: '',
    profile_img: '',
    username: '',
    bio: ''
  },
  social_links:{
    youtube: '',
    instagram:'',
    facebook: '',
    twitter: '',
    github:'',
    website: ''
  },
_id: ''
}

const Profile = () => { 
  const { id:profileId } = useParams();
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blogStats, setBlogStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})

  const { personal_info: { fullname:name, username:profile_username, profile_img, bio }}  = profile
  const { account_info : {total_reads, total_posts} }  = profile
  const { social_links , joinedAt }  = profile
  const { _id: userId } = profile;
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const { userInfo: {username} } = useSelector((state:any) => state.auth);  
 

  const getProfile = async() => {
    try{
      const res = await fetch('/api/users/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profileId })
      })
      const { user } = await res.json();
      if(user != null){
        setProfile(user);      
      }      
      getBLogPosts();
      setLoading(false)      
    }catch(error){
      console.log('error >>', error)
      setLoading(false)
    }
  }

  const getBLogPosts = async(page:number = 1) => {
    try {
      const res = await fetch(`/api/post/search-blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "authorId": userId,
          page
        })
      });
      // const { results, currentPage, totalBlogs, totalPages } = await res.json();  
      const { data, currentPage, totalCount, totalPages } = await res.json();      
      if (blogs && blogs.length > 0) {
        // Concatenate new data with existing blogs
        setBlogs([...blogs, ...data]);
      } else {
        // Set the fetched blogs directly
        setBlogs(data);
      }
      setBlogStats({currentPage, totalCount, totalPages})
      // console.log('pageState', pageState);
      
    } catch (error) {
      console.log('error', error);
    }
  }

 

  useEffect(() => {
    getProfile();    
  }, [userId, profileId])

 
  return (
    <AnimationWrapper>
      {
        loading ? (
          <Loader/>
        ) : (          
            profile_username.length ? (
              <section className="container xl:px-[5vw] h-cover md:flex flex-row-reverse items-start">
                <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:border-l  border-grey md:w-[50%] md:pl-8 md:sticky md:top-[80px] md:pt-10">
                  <img src={profile_img} alt="profile image" className="rounded-full w-48 h-48 bg-grey md:w-32 md:h-32" />
                  <div className="flex flex-col max-md:items-center ">
                    <h1 className="twxt-2xl md:text-3xl font-medium">{name}</h1>
                    <p className="text-xl capitalize">@{profile_username}</p>
                  </div> 
                  <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
                  <div className="flex gap-4 mt-2">
                    {
                      username === profile_username ? (
                        <Link to='/settings/edit-profile' className="btn-light rounded-md">
                          Edit Profile
                        </Link>
                        ) :(
                          null
                        ) 
                    }                
                  </div>
                  <AboutUser classNames='max-md:hidden' bio={bio} joinedAt={joinedAt} social_links={social_links}/>
                </div>
                <div className=" w-full">
                {/* max-md:mt-12 */}
                  <InpageNavigation
                    activeTabRef={activeTabRef} 
                    routes={['Blogs Published', 'About']}
                    defaultHidden={['About']}
                  >
                    <div className="w-full lg:pr-8">
                      {
                        blogs == null ? (
                          <Loader />
                        ) : (
                          <>
                            {
                              blogs.length ? (
                                blogs.map((blog: any, index: number) => (
                                  <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                    <BlogCard content={blog} />
                                  </AnimationWrapper>
                                ))
                              ) : (
                                  <Nodata message={`No published blogs`} />
                              )
                            }
                          </>
                        )
                      }
                      <LoadMore state={blogStats} fetchDataFunction={getBLogPosts}/>
                    </div>
                    <AboutUser classNames='flex flex-col items-center' bio={bio} joinedAt={joinedAt} social_links={social_links}/>
                  </InpageNavigation>
                </div>
              </section>
            ) : (
              // <Navigate  to={'/page-not-found'}/>
              <PageNotFound/>
            )                    
        )
      }     
    </AnimationWrapper>
  )
}

export default Profile