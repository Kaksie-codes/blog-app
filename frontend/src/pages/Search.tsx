import { useParams } from "react-router-dom"
import InpageNavigation from "../components/InpageNavigation"
import { useEffect, useRef, useState } from "react";
import { Blog, PaginationStats } from "./Home";
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
    const [blogs, setBlogs] = useState<Blog[] | null>(null);
    const [blogStats, setBlogStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})
    const [users, setUsers] = useState<User[] | null>(null);

    const searchBlogs = async (page:number = 1) => {
        try {      
          const res = await fetch(`/api/post/search-blogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, query})
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

    

    const searchUsers = async () => {
        try {      
            const res = await fetch(`/api/users/search-users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            });
            const { users } = await res.json();      
            setUsers(users);            
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
    <AnimationWrapper>
        <section className="h-cover container xl:px-[5vw] pb-4 flex justify-center">
            <div className="flex-1">
                <InpageNavigation
                    routes={[`search results from "${query}"`, "Accounts Watched"]}
                    defaultHidden={["Accounts Watched"]}
                    activeTabRef={activeTabRef}
                >
                    <div className="w-full pr-10">
                        {
                            blogs == null ? (
                                <Loader />
                            ) : (
                          <>
                            { 
                                blogs  && blogs.length ? (
                                    blogs.map((blog: any, index: number) => (
                                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                            <BlogCard content={blog} />
                                        </AnimationWrapper>
                                        ))
                                    ) : (
                                    <Nodata message={`No results found for "${query}"`}/>
                                )
                            }
                           </>
                        )}
                        <LoadMore state={blogStats} fetchDataFunction={searchBlogs}/>
                    </div>
                    <UserCardWrapper/>
                </InpageNavigation>
            </div>
            <div className="w-[40%] xl:w-[30%] hidden md:block pt-4">
                <div className="h-cover  border-l border-grey w-full  max-md:hidden pl-8">
                    <h1 className="sticky top-[100px] shadow-sm py-4 font-medium text-xl mb-8 flex items-center gap-2">
                        User related to search
                        <i className="fi fi-rr-user mt-1"></i>
                    </h1>
                    <UserCardWrapper/>
                </div>
            </div>
        </section>
    </AnimationWrapper>
  )
}
 
export default Search 