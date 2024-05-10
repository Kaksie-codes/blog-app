import { useContext, useEffect, useRef, useState } from "react";
import { PaginationStats } from "./Home";
import InpageNavigation from "../components/InpageNavigation";
import ManageUserCard from "../components/ManageUserCard";
import AnimationWrapper from "../libs/page-animation";
import Nodata from "../components/Nodata";
import { AdminContext } from "../App";
import LoadMore from "../components/LoadMore";

export interface User {
    joinedAt: string;
    personal_info:{
        bio: string;
        email: string;
        fullname: string;
        profile_img: string;
        username: string;
    };
    role: string;
    verified: boolean;
    _id: string;
}


const ManageUsers = () => {
    const [searchedUsers, setSearchedUsers] = useState<User[] | null>(null);
    const [allUsers, setAllUsers] = useState<User[] | null>(null);
    const [verifiedUsers, setVerifiedUsers] = useState<User[] | null>(null);
    const [unVerifiedUsers, setUnVerifiedUsers] = useState<User[] | null>(null);    
    const [userStats, setUserStats] = useState<PaginationStats>({currentPage: 1, totalCount: 0, totalPages:1})
    const [query, setQuery] = useState("");
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const { activeFilter } = useContext(AdminContext);  
    const [prevFilter, setPrevFilter] = useState('');  

    // console.log('<<<====== allUsers before ======>>>', allUsers)  
    const handleChange = (e:any) => {
        e.preventDefault();
        let searchQuery = e.target.value;    
        setQuery(searchQuery); 

        if(!e.target.value.length){
          setQuery("");  
          setSearchedUsers(null);      
        }
      }
    
      const handleSearch = (e:any) => { 
        if(e.keyCode == 13 && query.length){ 
            searchUsers();
        } 
      }

      const searchUsers = async () => {
        try {            
            const res = await fetch(`/api/users/search-users?query=${query}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },                
              });
              const { data } = await res.json();               
              if(searchedUsers && searchedUsers.length > 0){
                // Append fetched data to existing notifications
                setSearchedUsers([...searchedUsers, ...data]);
              }else{
                setSearchedUsers(data);
              }               
        } catch (error) {
            console.log('error', error);
        }
      }

      const getAllUsers = async (page:number, activeFilter:string) => {      
        try {      
          const res = await fetch(`/api/users/get-all-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, filter: activeFilter })
          });
          const { data, currentPage, totalCount, totalPages } = await res.json(); 
        //   console.log('<<<====== searching ======>>>')     
          if (activeFilter.toLocaleLowerCase() === 'all') {
            if(prevFilter === activeFilter){
                if(allUsers && allUsers.length > 0){
                    // Append fetched data to existing notifications
                    setAllUsers([...allUsers, ...data]);
               }else{
                   setAllUsers(data);
               }             
            }else{
                setAllUsers(data);
            } 
            // console.log('<<<====== allUsers after ======>>>', allUsers)               
        } else if(activeFilter.toLocaleLowerCase() === 'verified') {
            if(prevFilter === activeFilter){
                if(verifiedUsers && verifiedUsers.length > 0){
                    // Append fetched data to existing notifications
                    setVerifiedUsers([...verifiedUsers, ...data]);
               }else{
                    setVerifiedUsers(data);
               }   
            }else{
                setVerifiedUsers(data);
            }            
        }else if(activeFilter.toLocaleLowerCase() === 'unverified'){
            if(prevFilter === activeFilter){
                if(unVerifiedUsers && unVerifiedUsers.length > 0){
                    // Append fetched data to existing notifications
                    setUnVerifiedUsers([...unVerifiedUsers, ...data]);
               }else{
                    setUnVerifiedUsers(data);
               }   
            }else{
                setUnVerifiedUsers(data);
            }            
        }
          setUserStats({currentPage, totalCount, totalPages});  
          setPrevFilter(activeFilter);        
        } catch (error) {
          console.log('error', error);
        }
      }; 

      useEffect(() => {
        if (activeTabRef.current) { 
            activeTabRef.current.click();          
          }
      }, [])
     
      
      useEffect(() => {
            setAllUsers(null);          
            setVerifiedUsers(null);          
            setUnVerifiedUsers(null);       
          getAllUsers(userStats.currentPage, activeFilter);
      }, [activeFilter])

    //   console.log('search query ====>>>', query);    
    // console.log('page ====>>>', userStats.currentPage);    


  return (
    <div>
        <h1 className="max-md:hidden">Manage Users</h1>
        <div className="relative max-md:mt-5 md:mt-8 mb-10"> 
            <input 
            type="search" 
            onChange={handleChange}
            onKeyDown={handleSearch}
            className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
            placeholder="Search Users"
            />
            <i className="fi fi-rr-search absolute right-[10%] top-1/2 md:left-5 md:pointer-events-none -translate-y-1/2 text-xl text-dark-grey"></i>
        </div> 
        <div className="w-full text-right">
            <p>count: {userStats.totalCount}</p>
        </div>
        {
            searchedUsers ? (
                searchedUsers.length ? (
                    searchedUsers.map((user, index) => (
                        <AnimationWrapper  key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                            <ManageUserCard  
                                data={user}
                                index={index}
                                getAllUsers={getAllUsers}
                                count={userStats}
                                setCount={setUserStats}                                
                                state={searchedUsers}
                                setState={setSearchedUsers}                                
                            />
                        </AnimationWrapper>
                    ))
                ) : (
                    <Nodata message="No user found"/>
                )
            ) : (
                <InpageNavigation 
                    routes={["All", "Verified", "Unverified"]}
                    activeTabRef={activeTabRef}
                >
                    <>
                        {
                            allUsers && allUsers.length ? (
                                allUsers.map((user, index) => (
                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                        <ManageUserCard  
                                            data={user}
                                            index={index}
                                            count={userStats}
                                            setCount={setUserStats}   
                                            getAllUsers={getAllUsers} 
                                            setState={setAllUsers}
                                            state={allUsers}                                            
                                        />
                                    </AnimationWrapper>                            
                                )) 
                            ) : (
                                <Nodata message={'No user found'} />
                            )
                        }
                        <LoadMore state={userStats} fetchUsers={getAllUsers}/>
                    </>
                    <>
                        {
                            verifiedUsers && verifiedUsers.length ? (
                                verifiedUsers.map((user, index) => (
                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                        <ManageUserCard  
                                            data={user}
                                            index={index}
                                            count={userStats}
                                            setCount={setUserStats}   
                                            getAllUsers={getAllUsers}                 
                                            state={verifiedUsers}
                                            setState={setVerifiedUsers}
                                        />
                                    </AnimationWrapper>                            
                                )) 
                            ) : (
                                <Nodata message={'No Verified user found'} />
                            )
                        }
                        <LoadMore state={userStats} fetchUsers={getAllUsers}/>
                    </>            
                    <>
                        {
                            unVerifiedUsers && unVerifiedUsers.length ? (
                                unVerifiedUsers.map((user, index) => (
                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                        <ManageUserCard  
                                            data={user}
                                            index={index}
                                            count={userStats}
                                            setCount={setUserStats}   
                                            getAllUsers={getAllUsers}                                            
                                            state={unVerifiedUsers}
                                            setState={setUnVerifiedUsers}                                            
                                        />
                                    </AnimationWrapper>                            
                                )) 
                            ) : (
                                <Nodata message={'No Unverified user found'} />
                            )
                        }
                        <LoadMore state={userStats} fetchUsers={getAllUsers}/>
                    </>           
                </InpageNavigation>
            )
        }
    </div>
  )
}
 
export default ManageUsers