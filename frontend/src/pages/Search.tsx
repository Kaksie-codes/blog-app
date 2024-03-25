import { useParams } from "react-router-dom"
import InpageNavigation from "../components/InpageNavigation"
import { useEffect, useRef, useState } from "react";
import { BlogApiResponse } from "./Home";
import AnimationWrapper from "../libs/page-animation";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";
import UserCard from "../components/UserCard";

export interface User{
    personal_info:{
        username: string;
        fullname: string;
        profile_img:string
    }
}

const Search = () => {
    const { query } = useParams();
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const [blogs, setBlogs] = useState<BlogApiResponse | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);

    const searchBlogs = async (page:number = 1) => {
        try {      
          const res = await fetch(`/api/post/search-blogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, query})
          });
          const { results, currentPage, totalBlogs, totalPages } = await res.json();      
          setBlogs({ results, currentPage, totalBlogs, totalPages });
        } catch (error) {
          console.log('error', error);
        }
    };

    const searchUsers = async () => {
        try {      
            const res = await fetch(`/api/users/search-users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            });
            const { users } = await res.json();      
            setUsers(users);
            console.log('users', users)
          } catch (error) {
            console.log('error', error);
          }
    }

    useEffect(() => {
        searchBlogs();
        searchUsers();
    }, [query])

    const UserCardWrapper = () => {

        return (
            <>
                {
                    users == null ? (
                        <Loader/>
                    ) : (
                        users?.length ? users?.map((user, index) => {
                            return (
                            <AnimationWrapper key={index} transition={{duration:1, delay: index*0.1}}>
                                <UserCard user={user} />
                            </AnimationWrapper>
                            )
                        }) : <Nodata message="No user found"/>
                    )
                }
            </>
        )
    }

  return (
    <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
            <InpageNavigation 
                routes={[`search results from "${query}"`, "Accounts Watched"]}
                defaultHidden={["Accounts Watched"]}
                activeTabRef={activeTabRef}>
                <>
                  <div className="max-w-[700px]">
                  {
                    blogs == null ? (
                        <Loader />
                    ) : (
                      <>
                       {blogs && blogs.results && blogs.results.length ? (
    blogs.results.map((blog: any, index: number) => (
        <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
            <BlogCard content={blog} />
        </AnimationWrapper>
    ))
) : (
    
    <Nodata message={`No results found for "${query}"`} />
)}
                       </>
                    )}
                    <LoadMore state={blogs} fetchDataFunction={searchBlogs}/>
                  </div>
                </>
                <UserCardWrapper/>
            </InpageNavigation>
        </div>
        <div className="border-l border-grey min-w-[40%] max-w-min lg:min-w-[650px] max-md:hidden pl-8 pt-3">
            <h1 className="font-medium text-xl mb-8 flex items-center gap-2">
                User related to search
                <i className="fi fi-rr-user mt-1"></i>
            </h1>
            <UserCardWrapper/>
        </div>
    </section>
  )
}

export default Search 