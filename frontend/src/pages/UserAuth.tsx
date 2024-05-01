import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import { setAuthPageMode } from "../redux/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import AnimationWrapper from "../libs/page-animation";
import { Link } from "react-router-dom";
import logo from '../imgs/logo.png'

export interface FormData {    
    username?: string;
    email?: string;
    password?: string;
    passwordCheck?:string;    
}

const UserAuth = () => {
    const { authPageMode } = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    
    
 
  return (
    <div className="grid place-items-center bg-grey min-h-screen">        
        <Link to={'/'} className='flex items-center justify-center gap-1 fixed top-3 left-6'>
            <img src={logo} alt="logo"  className='flex-none w-6 lg:w-10'/>
            <p className='font-bold text-xl lg:text-2xl'>enBlogg</p>
        </Link>
        <div className="max-h-[85vh] bg-white relative overflow-hidden w-[86vw]  xl:w-[70vw] max-w-[500px] lg:max-w-[1000px] px-5 py-8 rounded-[15px] shadow-lg">
            <div className={`hidden lg:block absolute top-0 ${authPageMode == 'sign-in' ? 'translate-x-full' : 'translate-x-0'} -left-[50%] w-full h-full bg-gradient-to-l from-pink-200 to-pink-600 z-20 transform  transition duration-1000 ease-in-out`}></div>
            <div className="w-full  h-full flex items-center gap-12 justify-between ">
                <SignIn/>
                <SignUp/>
            </div>
            <div className={`${authPageMode == 'sign-in' ? 'lg:flex lg:top-0 lg:right-0 lg:z-50' : 'lg:hidden'} hidden  absolute px-12 lg:grid place-content-center  h-full w-[50%] `}>
               <AnimationWrapper transition={{ duration: 3,} }>
                   <div className=" text-white text-center flex gap-3 justify-center flex-col items-center">
                        <h1 className="text-4xl  font-gelasio">New to enBlogg?</h1>
                        <p>
                            Register with your personal details to use all of enBlogg features
                         </p>
                         <button 
                            className="btn-dark"
                            onClick={() => dispatch(setAuthPageMode('sign-up'))}
                        >
                            Join us today
                        </button>
                    </div>
               </AnimationWrapper>
            </div>
            <div className={`${authPageMode == 'sign-up' ? 'lg:flex lg:top-0 lg:left-0 lg:z-50' : 'lg:hidden'} absolute hidden px-12 lg:grid place-content-center  h-full w-[50%] `}>
               <AnimationWrapper transition={{ duration: 3,} }>
                   <div className="text-white text-center flex gap-3 justify-center flex-col items-center">
                        <h1 className="text-4xl  font-gelasio capitalize">Welcome Back</h1>
                        <p>
                            Enter your personal details to use all of enBlogg features
                         </p>
                         <button 
                            className="btn-dark"
                            onClick={() => dispatch(setAuthPageMode('sign-in'))}
                        >
                            Log in
                        </button>
                    </div>
               </AnimationWrapper>
            </div>
        </div>        
    </div>
  )
}

export default UserAuth

