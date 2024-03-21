import { Link, useNavigate } from "react-router-dom"
import InputBox from "../components/InputBox"
import GoogleIcon from '../imgs/google.png'
import AnimationWrapper from "../common/page-animation"
import { useState } from "react"
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"

const UserSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.user)
    const [formData, setformData] = useState({        
        email:"", 
        password:"",  
        }); 

    const [validationErrors, setValidationErrors] = useState({        
        email:"", 
        password:"",       
    })   
    
    const handleChange = (e:any) => {        
        const { value, id } = e.target;
        setformData({            
            ...formData,
            [id]: value.trim()                 
        }) 
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setValidationErrors({...validationErrors})
        
        dispatch(signInStart());
        try{ 
            const res = await fetch(`/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                // throw new Error('Failed to submit form');
                dispatch(signInFailure('Failed to submit form'))
            }

            const data = await res.json();
            dispatch(signInSuccess(data));
            console.log('signed in');            
            console.log(data);
            navigate('/');            
        }catch(err){            
            dispatch(signInFailure(err))
            console.log('error >>', err)
        }    
    }

  return (
    <AnimationWrapper>
        <section className="h-cover flex items-center justify-center">            
            <div className="w-[80%] max-w-[400px]">
                <form className="w-full" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center  mb-24 ">
                        Welcome back
                    </h1>                    
                    <InputBox
                        classNames={`bg-grey border-grey focus:bg-transparent`}
                        name="email"
                        type='email'
                        placeholder="Email"
                        id='email'
                        onChange={handleChange}
                        icon="fi-rr-envelope"
                        value={formData.email}
                        errorMessage={validationErrors.email}
                    />
                    <InputBox
                        classNames={`bg-grey border-grey focus:bg-transparent`}
                        name="password"
                        type='password'
                        placeholder="Password"
                        id='password'
                        onChange={handleChange}
                        icon="fi-rr-key"
                        value={formData.password}
                        errorMessage={validationErrors.password}
                    />    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-dark center mt-14"                        
                    >                        
                        {
                            isLoading ? <span className="animate-pulse">Signing in...</span> : <span>Sign In</span>
                        }
                    </button>                                       
                </form>
                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black"/>
                        <hr className="w-1/2 border-black"/>
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        Continue with Google
                        <img src={GoogleIcon} alt="google icon" className="w-5" />
                    </button>
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account ?
                        <Link to={'/signup'} className="underline text-black text-xl ml-1">
                            Join us today
                        </Link>
                    </p>
                </div>
        </section>
    </AnimationWrapper>
  )
}

export default UserSignIn