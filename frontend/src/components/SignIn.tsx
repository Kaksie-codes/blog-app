import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { setCredentials, setAuthPageMode } from "../redux/auth/authSlice";
import toast from "react-hot-toast";
import Oauth from "./Oauth";
import InputBox from "./InputBox";
import AnimationWrapper from "../libs/page-animation";
import { FormData } from "../pages/UserAuth";


const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(false);    
    const { userInfo, authPageMode } = useSelector((state:any) => state.auth);

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email    

    const [signInData, setSignInData] = useState({        
        email:"", 
        password:"",   
        }); 

    const [validationErrors, setValidationErrors] = useState<FormData>({        
        email:"", 
        password:"",       
    })   

    const handleChange = (e:any) => {        
        const { value, id, name } = e.target;
        setSignInData({            
            ...signInData,
            [name]: value.trim()                 
        }) 
    }

    const validateForm = () => {
        const validationErrors: Partial<FormData> = {};
        
        if (!signInData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(signInData.email)) {
            validationErrors.email = 'Email is invalid';
        }
    
        if (!signInData.password.trim()) {
            validationErrors.password = 'Password is required';
        }
    
        setValidationErrors(validationErrors as FormData);
    
        // If there are any validation errors, return false
        return Object.keys(validationErrors).length === 0;
    }
    

const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsloading(true);

    // Check if the form is valid
    const isValidForm = validateForm();

    // If the form is not valid, stop form submission
    if (!isValidForm) {
        setIsloading(false);
        return;
    }

    try {
        // Submit the form data
        const res = await fetch(`/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signInData),
        });
        const result = await res.json();
        const { user } = result;

        if (result.success === false) {
            toast.error(result.message);
        } else {
            dispatch(setCredentials(user));
            navigate('/');
        }
    } catch (err) {
        console.log('backend error >>', err);
        // toast.error(err?.data?.message)
    } finally {
        setIsloading(false);
    }
}

  return (
    <>
        {
            userInfo ? (
                <Navigate to={'/'}/>
            ) : (
                <div className={`"w-full lg:w-[50%]  ${authPageMode == 'sign-in' ? 'block' : 'hidden'} lg:block`}>
                    <AnimationWrapper>
                        <div className="">
                            <form className="" >
                                <h1 className="text-4xl mb-3 font-gelasio capitalize text-center">
                                    Welcome back
                                </h1>
                                <InputBox                                    
                                    name="email"
                                    type='email'
                                    placeholder="Email"
                                    // id='email'
                                    onChange={handleChange}
                                    icon="fi-rr-envelope"
                                    value={signInData.email}
                                    errorMessage={validationErrors.email}
                                />
                                <InputBox                                    
                                    name="password"
                                    type='password'
                                    placeholder="Password"
                                    // id='password'
                                    onChange={handleChange}
                                    icon="fi-rr-key"
                                    value={signInData.password}
                                    errorMessage={validationErrors.password}
                                />
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn-dark center  ${isLoading ? 'cursor-not-allowed' : ''}`}
                                >
                                    {
                                        isLoading ? <span className="animate-pulse">Signing in...</span> : <span>Sign In</span>
                                    }
                                </button>
                            </form>
                            <div className="relative w-full my-4 flex items-center gap-2 opacity-10 uppercase text-black font-bold">
                                    <hr className="w-1/2 border-black"/>
                                    <hr className="w-1/2 border-black"/>
                            </div>
                            <Oauth/>
                            <p className="text-center w-full mt-2">
                                <Link
                                    className=" text-black text-xl underline "
                                    to={'/reset-password'}>
                                    Forgot Password
                                </Link>
                            </p>
                            <p className="mt-4 text-dark-grey text-xl text-center md:hidden">
                                Don't have an account ?
                                <button 
                                    className="underline text-black text-xl ml-1"
                                    onClick={() => dispatch(setAuthPageMode('sign-up'))}>
                                    Join us today
                                </button>                                
                            </p>
                        </div>
                    </AnimationWrapper>
                </div>
            )
        }
    </>   
  )
}

export default SignIn