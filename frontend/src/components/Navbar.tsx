import { useEffect, useRef, useState } from 'react'
import logo from '../imgs/logo.png'
import { Link, Outlet, useNavigate, } from 'react-router-dom'
import { useSelector } from "react-redux"
import UserNavigation from './UserNavigation'

const Navbar = () => {  
    const navPanelRef  = useRef(null);
    const { currentUser } = useSelector((state:any) => state.user);
    const accessToken = currentUser ? currentUser.accessToken : null;
    const profilePic = currentUser ? currentUser.profile_img : null;
    const [searchBoxVisibility, setSeachBoxVisibility] = useState<boolean>(false);
    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);
    const navigate = useNavigate();

    const closeNav = (e:any) => {
        // Check if the click occurred outside the navigation menu
        if (navPanelRef.current && !navPanelRef.current.contains(e.target)) {
            // Check if the clicked element or its parent has the toggle button class
            if (!e.target.classList.contains('nav__toggle')) {
                setIsNavPanelVisible(false);
            }
        }
    };

    const handleSearch = (e:any) => {
        let query = e.target.value;
        if(e.keyCode == 13 && query.length){
            navigate(`/search/${query}`)
        }
    }
    

    useEffect(() => {    
        document.addEventListener('click', closeNav);
        return () => {        
            document.removeEventListener('click', closeNav);
        }       
      },[closeNav]);
      

  return (
    <>
        <nav className="navbar">
            <Link to={'/'} className='flex items-center justify-center gap-1'>                
                <img src={logo} alt="logo"  className='flex-none w-6 lg:w-10'/>
                <p className='font-bold text-xl lg:text-2xl'>enBlogg</p>
            </Link>
            <div className={`absolute bg-white left-0 w-full top-full mt-0.5 border-b md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto border-grey py-4 px-[5vw] md:show ${searchBoxVisibility ? 'show' : 'hide'}`}>
                <input
                    type="text"
                    onKeyDown={handleSearch}
                    placeholder='Search'
                    className='w-full md:w-auto p-4 pl-6 bg-grey pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' />
                <i className='fi fi-rr-search absolute right-[10%]  md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>
            <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                <button onClick={() => setSeachBoxVisibility(!searchBoxVisibility)} className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center '>
                     <i className='fi fi-rr-search text-xl'></i>
                </button>
                <Link to={'/editor'} className='hidden md:flex gap-2 link'>
                    <i className='fi fi-rr-file-edit'></i>
                    <p>Write</p>
                </Link>
                {
                    accessToken ? (
                        <>
                            <Link to={'/dashboard/notifications'}>
                                <button className='w-12 h-12 bg-grey rounded-full relative hover:bg-black/10 '>
                                    <i className='fi fi-rr-bell text-2xl flex items-center justify-center'></i>
                                </button>
                            </Link>
                            <div className="relative nav__toggle" onClick={() => setIsNavPanelVisible(!isNavPanelVisible)} ref={navPanelRef}>
                                <button className='w-12 h-12 mt-1 '>
                                    <img 
                                        src={profilePic} alt="profile image" className='rounded-full h-full w-full object-cover cursor-pointer' />
                                </button>
                                {isNavPanelVisible && <UserNavigation/>}                                
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to={'/signin'} className='btn-dark py-2'>
                                Sign In
                            </Link>
                            <Link to={'/signup'} className='btn-light py-2 hidden md:block'>
                                Sign Up
                            </Link>
                        </>
                    )
                }                
            </div>
        </nav>
        <Outlet/>
    </>
  )
}

export default Navbar