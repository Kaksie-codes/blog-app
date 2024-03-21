import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import UserSignIn from './pages/UserSignIn'
import UserSignUp from './pages/UserSignUp'
import Profile from './pages/Profile'
import Editor from './pages/Editor'


function App() {
 

  return (
    <>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route path='signin' element={<UserSignIn/>}/>
          <Route path='signup' element={<UserSignUp/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='editor' element={<Editor/>}/>
        </Route>        
      </Routes>
    </>
  )
}

export default App
