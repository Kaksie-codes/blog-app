import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import UserSignIn from './pages/UserSignIn'
import UserSignUp from './pages/UserSignUp'
import Profile from './pages/Profile'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Search from './pages/Search'
import PageNotFound from './pages/PageNotFound'


function App() {
 

  return (
    <>      
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route index element={<Home/>}/>
          <Route path='signin' element={<UserSignIn/>}/>
          <Route path='signup' element={<UserSignUp/>}/>
          <Route path='profile' element={<Profile/>}/> 
          <Route path='search/:query' element={<Search/>}/> 
          <Route path='users/:id' element={<Profile/>}/> 
          <Route path='*' element={<PageNotFound/>}/>          
        </Route>        
        <Route path='/editor' element={<Editor/>}/> 
      </Routes>
    </>
  )
}

export default App
