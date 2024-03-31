import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import UserSignIn from './pages/UserAuth'
import UserSignUp from './pages/UserSignUp'
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
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/OTPS'
import VerifyUser from './pages/VerifyUser'
import UserAuth from './pages/UserAuth'

function App() {
 

  return (
    <> 
      <ToastContainer/>   
      <Toaster/>  
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route index element={<Home/>}/>
          
          {/* <Route path='signup' element={<UserSignUp/>}/> */}
          <Route path='forgot-password' element={<ForgotPassword/>}/>
          <Route path='reset-password' element={<ResetPassword/>}/>          
          <Route path='profile' element={<Profile/>}/> 
          <Route path='search/:query' element={<Search/>}/>
          <Route path='blogs/:blog_id' element={<BlogPage/>}/> 

                   {/*Protected Routes  */}
          <Route path='' element={<PrivateRoute/>}>
            <Route path='verify/:token' element={<VerifyUser/>}/>
            <Route path='private' element={<PrivatePage/>}/>
            <Route path='users/:id' element={<Profile/>}/> 
          </Route>

                  {/* Admin private Routes */}
          <Route path='' element={<OnlyAdminPrivateRoutes/>}>
            <Route path='admin' element={<AdminDashboard/>}/>
          </Route>

          <Route path='*' element={<PageNotFound/>}/>          
        </Route>

        <Route path='/auth' element={<UserAuth/>}/>
                {/*Protected Routes  */}
        <Route path='' element={<PrivateRoute/>}>
          <Route path='/editor' element={<Editor/>}/> 
          <Route path='/editor/:blog_id' element={<Editor/>}/> 
        </Route>
        
      </Routes>
    </>
  )
}

export default App
