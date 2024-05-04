import { useEffect, useRef, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"


const SideNavbar = () => {
    const location = useLocation();
    let page = location.pathname.split('/')[2]
    let [pageState, setPageState] = useState<string | undefined>(page.replace('-', " "));
    let activeTabLine = useRef<HTMLHRElement>(null);
    let sidebarIconTab = useRef<HTMLButtonElement>(null);
    let pageStateTab = useRef<HTMLButtonElement>(null);
    let [showSideNav, setShowSideNav] = useState(false);

    const changePageState = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { offsetLeft, offsetWidth } = e.target as HTMLButtonElement; 
        if (activeTabLine.current) {
            activeTabLine.current.style.width = offsetWidth + 'px';
            activeTabLine.current.style.left = offsetLeft + 'px';
        }

        if(e.target === sidebarIconTab.current || sidebarIconTab.current?.contains(e.target as Node)){
            setShowSideNav(true);
        }else{
            setShowSideNav(false);
        }
    }

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current?.click()
    }, [pageState])

  return ( 
    <>
        <section className="relative flex gap-10 py-0 m-0 max-md:flex-col container mx-auto">
            <div className="sticky z-[5] top-[80px]">
                <div className="md:hidden flex bg-white py-1 border-b border-grey flex-nowrap overflow-x-auto">
                    <button ref={sidebarIconTab} onClick={changePageState}  className="p-5 capitalize ">
                        <i  className="fi fi-rr-bars-staggered pointer-events-none"></i>
                    </button>
                    <button ref={pageStateTab} onClick={changePageState} className="p-5 capitalize ">
                        {pageState}
                    </button>
                    <hr ref={activeTabLine} className="absolute bg-black border-black bottom-0 duration-500"/>
                </div>
                {/* h-[calc(100vh-80px-60px)] */}
                {/* max-md:w-[calc(100%+80px] */}
                {/* max-md:ml-7 */}
                <div className={`min-w-[200px] max-md:w-[calc(100%+80px] max-md:h-[calc(100vh-80px-60px)]  w-full  md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white  max-md:w-full max-md:px-10  duration-500 ${!showSideNav ? 'max-md:opacity-0 max-md:pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                    <h1 className="text-xl text-dark-grey mb-3">
                        Dashboard
                    </h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6"/>
                    <NavLink 
                        to={'/dashboard/blogs'}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setPageState(e.currentTarget.innerText || undefined)}
                        className='sidebar-link'
                    >
                        <i className="fi fi-rr-document"></i>
                        Blogs
                    </NavLink>
                    <NavLink 
                        to={'/dashboard/notification'}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setPageState(e.currentTarget.innerText || undefined)}
                        className='sidebar-link'
                    >
                        <i className="fi fi-rr-bell"></i>
                        Noticications
                    </NavLink>
                    <NavLink 
                        to={'/editor'}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setPageState(e.currentTarget.innerText || undefined)}
                        className='sidebar-link'
                    >
                        <i className="fi fi-rr-file-edit"></i>
                        Write
                    </NavLink>
                    <h1 className="text-xl text-dark-grey mb-3 mt-20">
                        Settings
                    </h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6"/>
                    <NavLink 
                        to={'/settings/edit-profile'}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setPageState(e.currentTarget.innerText || undefined)}
                        className='sidebar-link'
                    >
                        <i className="fi fi-rr-user"></i>
                        Edit Profile
                    </NavLink>
                    <NavLink 
                        to={'/settings/change-password'}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setPageState(e.currentTarget.innerText || undefined)}
                        className='sidebar-link'
                    >
                        <i className="fi fi-rr-lock"></i>
                        Change Password
                    </NavLink>
                </div>
            </div>
            <div className="max-md:-mt-8 mt-5 w-full">
                <Outlet/>
            </div>
        </section>        
    </>
  )
}

export default SideNavbar