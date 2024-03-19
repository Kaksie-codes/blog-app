import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import UserAuthForm from './pages/UserAuthForm'

function App() {  

  return (
    <>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route path='signin' element={<UserAuthForm type='sign-in'/>}/>
          <Route path='signup' element={<UserAuthForm type='sign-up'/>}/>
        </Route>        
      </Routes>
    </>
  )
}

export default App
