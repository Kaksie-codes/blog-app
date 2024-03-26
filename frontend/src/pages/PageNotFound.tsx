import { Link } from 'react-router-dom'
import pagenotfound from '../imgs/404.png'
import logo from '../imgs/logo.png'

const PageNotFound = () => {
  return (
    <section className="container xl:px-[5vw] h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img src={pagenotfound} alt="404 image" className='select-none w-72 aspect-square object-cover border-grey'/>
      <h1 className='font-gelasio text-4xl leading-7'>Oops! Page Not Found.</h1>
      <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for does not exist. Head back to the <Link className='text-black underline' to={'/'}>home page</Link> </p>
      <Link to={'/'} className='flex items-center justify-center gap-1 mt-auto'>                
          <img src={logo} alt="logo"  className='flex-none w-8 lg:w-12 select-none'/>
          <p className='font-bold text-xl lg:text-3xl'>enBlogg</p>
      </Link>
      <p className='mt-5 text-dark-grey'>Read millions of stories around the world</p>
    </section>
  )
}

export default PageNotFound