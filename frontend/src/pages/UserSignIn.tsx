import { Link, Navigate, useNavigate } from "react-router-dom"
import InputBox from "../components/InputBox"
import AnimationWrapper from "../libs/page-animation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Oauth from "../components/Oauth"
import { setCredentials } from "../redux/auth/authSlice"
import { toast } from "react-toastify"
import { FormData } from "./UserSignUp"

const UserSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(false);    
    const { userInfo } = useSelector((state:any) => state.auth);

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email    

    const [formData, setformData] = useState({        
        email:"", 
        password:"",  
        }); 

    const [validationErrors, setValidationErrors] = useState<FormData>({        
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

    const validateForm = () => {
        const validationErrors: Partial<FormData> = {};
        
        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            validationErrors.email = 'Email is invalid';
        }
    
        if (!formData.password.trim()) {
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
            body: JSON.stringify(formData),
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
                <AnimationWrapper>
                <section className="container xl:px-[5vw] h-cover flex items-center justify-center">            
                    <div className="w-[80%] max-w-[400px]">
                        <form className="w-full" >
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
                                onClick={handleSubmit}
                                type="submit"
                                disabled={isLoading}
                                className={`btn-dark center mt-14 ${isLoading ? 'cursor-not-allowed' : ''}`}                        
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
                            <Oauth/>
                            <p className="text-center w-full mt-2">
                                <Link 
                                    className=" text-black text-xl underline "
                                    to={'/forgot-password'}>
                                    Forgot Password
                                </Link>
                            </p>                            
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
    </>   
  )
}

export default UserSignIn