import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Search from './pages/Search'
import PageNotFound from './pages/PageNotFound'
import BlogPage from './pages/BlogPage'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute'
import PrivatePage from './pages/PrivatePage'
import OnlyAdminPrivateRoutes from './components/OnlyAdminPrivateRoutes'
// import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import VerifyUser from './pages/VerifyUser'
import UserAuth from './pages/UserAuth'
import SideNavbar from './components/SideNavbar'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'

function App() {
 

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
          
                   {/*Protected Routes  */}
          <Route path='' element={<PrivateRoute/>}>             
            <Route path='private' element={<PrivatePage/>}/>
            <Route path='users/:id' element={<Profile/>}/> 
            <Route path='settings' element={<SideNavbar/>}>
              <Route path='edit-profile' element={<EditProfile/>}/>
              <Route path='change-password' element={<ChangePassword/>}/>
            </Route>
          </Route>

                  {/* Admin private Routes */}
          <Route path='' element={<OnlyAdminPrivateRoutes/>}>
            {/* <Route path='admin' element={<AdminDashboard/>}/> */}
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
