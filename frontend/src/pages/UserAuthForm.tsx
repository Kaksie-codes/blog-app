import { Link } from "react-router-dom"
import InputBox from "../components/InputBox"
import GoogleIcon from '../imgs/google.png'
import AnimationWrapper from "../common/page-animation"

const UserAuthForm = ({type}: {type:string}) => {
  return (
    <AnimationWrapper keyValue={type} className="">
        <section className="h-cover flex items-center justify-center">
            <form action="" className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center  mb-24 ">
                    {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
                </h1>
                {
                    type !== 'sign-in' ?
                    <InputBox
                        name="fullname"
                        type='text'
                        placeholder="Full name"
                        id='23'
                        // value='du'
                        icon="fi-rr-user"/> :
                    ''
                }
                <InputBox
                    name="email"
                    type='email'
                    placeholder="Email"
                    id='21'
                    // value='du'
                    icon="fi-rr-envelope"/>
                <InputBox
                    name="password"
                    type='password'
                    placeholder="Password"
                    id='02'
                    // value='du'
                    icon="fi-rr-key"/>
                <button type="submit" className="btn-dark center mt-14">{type.replace('-', ' ')}</button>
                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black"/>
                    <hr className="w-1/2 border-black"/>
                </div>
                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                    Continue with Google
                    <img src={GoogleIcon} alt="google icon" className="w-5" />
                </button>
                {
                    type === 'sign-in' ? (
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account ?
                        <Link to={'/signup'} className="underline text-black text-xl ml-1">
                            Join us today
                        </Link>
                    </p>
                    ) : (
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member ?
                        <Link to={'/signin'} className="underline text-black text-xl ml-1">
                            Sign in here.
                        </Link>
                    </p>
                    )
                }
            </form>
        </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm 