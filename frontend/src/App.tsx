import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Profile from './pages/Profile'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Search from './pages/Search'
import PageNotFound from './pages/PageNotFound'
import BlogPage from './pages/BlogPage'
import toast, { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute'
import PrivatePage from './pages/PrivatePage'
import OnlyAdminPrivateRoutes from './components/OnlyAdminPrivateRoutes'
import ForgotPassword from './pages/ForgotPassword'
import VerifyUser from './pages/VerifyUser'
import UserAuth from './pages/UserAuth'
import SideNavbar from './components/SideNavbar'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'
import Notifications from './pages/Notifications'
import ManageBlogs from './pages/ManageBlogs'
import AdminSidebar from './components/AdminSidebar'
import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import { setCredentials, setVerificationStatus } from './redux/auth/authSlice'
import { useDispatch } from 'react-redux'

function App() {
  const navigate = useNavigate(); // Hook for navigating within React Router
  const [loading, setLoading] = useState(true); // State for managing loading state
  const dispatch = useDispatch();

  // Function to read authentication cookies
  const readCookies = async () => {  
    console.log('reading cookies  ====>>>');
    try {
        // Submit request to server to read cookies
        const res = await fetch(`/api/auth/read-cookies`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },                    
        });
        const {message, userData, success} = await res.json(); // Parse response JSON           
        if (success === false) {
            console.log(message); // Log error message if cookie reading fails
        } else {
            // Extract user data from response and dispatch actions to set user and authentication data
            const { fullname, userId, username, role, verified, profileImg, email } = userData;
            toast.success(message);
            console.log(userData);  

            dispatch(setCredentials({
              profile_img: profileImg,
              username,
              fullname,
              role,
              userId,
              email
            }));

            dispatch(setVerificationStatus(verified));  
        }
    } catch(err:any) {
        console.log('backend error >>', err.message); // Log backend error message if request fails       
    } finally {
        setLoading(false); // Set loading to false after cookie reading process completes
    }       
}

  // Effect hook to trigger cookie reading when navigation changes
  useEffect(() => {
      readCookies();
  }, [navigate]); 

  // Render loading state while fetching authentication data
  if (loading) {
    return (
        <div className="h-screen w-screen grid place-items-center bg-dark-1 ">
            <Loader/>
        </div>
    );
  }

  return (
    <> 
      <ToastContainer/>   
      <Toaster/>  
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route index element={<Home/>}/>
          
          {/* <Route path='signup' element={<UserSignUp/>}/> */} 
          <Route path='profile' element={<Profile/>}/> 
          <Route path='search/:query' element={<Search/>}/>
          <Route path='blogs/:slug' element={<BlogPage/>}/> 
          <Route path='users/:id/verify/:token' element={<VerifyUser/>}/>  

                  {/* Admin private Routes */}
          <Route path='' element={<OnlyAdminPrivateRoutes/>}>
            <Route path='settings' element={<AdminSidebar/>}>
              <Route path='edit-profile' element={<EditProfile/>}/>
              <Route path='change-password' element={<ChangePassword/>}/>
            </Route>
            <Route path='admin-dashboard' element={<AdminSidebar/>}>              
              <Route path='notifications' element={<Notifications/>}/>
              <Route path='blogs' element={<ManageBlogs/>}/>
              <Route path='users' element={<ManageBlogs/>}/>
            </Route>
          </Route>
          
                   {/*Protected Routes  */}
          <Route path='' element={<PrivateRoute/>}>             
            <Route path='private' element={<PrivatePage/>}/>
            <Route path='users/:id' element={<Profile/>}/> 
            <Route path='settings' element={<SideNavbar/>}>
              <Route path='edit-profile' element={<EditProfile/>}/>
              <Route path='change-password' element={<ChangePassword/>}/>
            </Route>
            <Route path='dashboard' element={<SideNavbar/>}>              
              <Route path='notifications' element={<Notifications/>}/>
              <Route path='blogs' element={<ManageBlogs/>}/>
            </Route>
          </Route>

          

          <Route path='*' element={<PageNotFound/>}/>          
        </Route>

        <Route path='/auth' element={<UserAuth/>}/>
        <Route path='reset-password' element={<ForgotPassword/>}/>
        
                {/*Protected Routes  */}
        <Route path='' element={<PrivateRoute/>}>
          <Route path='/editor' element={<Editor/>}/> 
          <Route path='/editor/:slug' element={<Editor/>}/> 
        </Route>
        
      </Routes>
    </>
  )
}

export default App
