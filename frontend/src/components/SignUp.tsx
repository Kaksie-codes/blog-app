import { Link, Navigate, useNavigate } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation"
import InputBox from "./InputBox"
import { setAuthPageMode, setCredentials } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { FormData } from "../pages/UserSignUp";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "./Oauth";


const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(false)

    const { userInfo } = useSelector((state:any) => state.auth);
    

    const [signUpData, setSignUpData] = useState({        
        username: "", 
        email:"", 
        password:"", 
        passwordCheck:""});     

    const [validationErrors, setValidationErrors] = useState<FormData>({        
        username: "", 
        email:"", 
        password:"", 
        passwordCheck:""});

    
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleChange = (e:any) => {        
        const { value, name } = e.target;
        setSignUpData({            
            ...signUpData,
            [name]: value.trim()                 
        }) 
    }

    const validateForm = () => {
        const validationErrors: Partial<FormData> = {};
        if(!signUpData.username.trim()){
            validationErrors.username = 'Username is required';            
        }else if(signUpData.username.length < 3){
            validationErrors.username = 'Username should not be less than three characters';  
        } 
        if(!signUpData.email.trim()){
            validationErrors.email = 'Email is required'
        }else if(!emailRegex.test(signUpData.email)){
            validationErrors.email = 'Email is invalid'
        }

        if(!signUpData.password.trim()){
            validationErrors.password = 'Password is required'
        }else if(!passwordRegex.test(signUpData.password)){
            validationErrors.password = 'Password should contain an Uppercase, a lower'
        }

        if(!signUpData.passwordCheck.trim()){
            validationErrors.passwordCheck = 'Password confirmation is required'
        }else if(signUpData.passwordCheck !== signUpData.password){
            validationErrors.passwordCheck = 'Passwords do not match'
        }

        setValidationErrors(validationErrors as FormData);

         // If there are any validation errors, return false
         return Object.keys(validationErrors).length === 0;
    }
   

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setIsloading(true);

       // Check if the form is valid
        const isValidForm = validateForm();

        // If the form is not valid, stop form submission
        if (!isValidForm) {
            setIsloading(false);
            return;
        }

        // console.log('formData >>', formData)
        setIsloading(true)
        try{ 
            const res = await fetch(`/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signUpData),
            });
            const result = await res.json(); 
            const { user } = result          
            // console.log('user >>', user); 
            if(result.success == false){
                toast.error(result.message);
                setIsloading(false)  
            }else{
                dispatch(setCredentials(user));
                setIsloading(false)
                navigate('/profile') 
            }     
        }catch(err){
            console.log('error >>', err);
            setIsloading(false);
        }    
    }
  return (
    <>
        {
            userInfo ? (
                <Navigate to={'/'}/>
            ) : (
                <div className="w-[50%]">
                    <AnimationWrapper>
                    
                        <div className="">
                            <form className="" onSubmit={handleSubmit}>
                                <h1 className="text-4xl mb-3 font-gelasio capitalize text-center">
                                    Create Account
                                </h1>
                                <InputBox
                                    classNames={`bg-grey ${validationErrors.username ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                    name="username"
                                    type='text'
                                    placeholder="Username"
                                    // id='username'
                                    onChange={handleChange}
                                    icon="fi-rr-user"
                                    value={signUpData.username}
                                    errorMessage={validationErrors.username}
                                />
                                <InputBox
                                    classNames={`bg-grey ${validationErrors.email ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                    name="email"
                                    type='email'
                                    placeholder="Email"
                                    // id='email'
                                    onChange={handleChange}
                                    icon="fi-rr-envelope"
                                    value={signUpData.email}
                                    errorMessage={validationErrors.email}
                                />
                                <InputBox
                                    classNames={`bg-grey ${validationErrors.password ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                    name="password"
                                    type='password'
                                    placeholder="Password"
                                    // id='password'
                                    onChange={handleChange}
                                    icon="fi-rr-key"
                                    value={signUpData.password}
                                    errorMessage={validationErrors.password}
                                />
                                <InputBox
                                    classNames={`bg-grey ${validationErrors.passwordCheck ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                    name="passwordCheck"
                                    type='password'
                                    placeholder="Confirm Password"
                                    // id='passwordCheck'
                                    onChange={handleChange}
                                    icon="fi-rr-key"
                                    value={signUpData.passwordCheck}
                                    errorMessage={validationErrors.passwordCheck}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-dark center mt-3"
                                >
                                    {isLoading ? <span  className="animate-pulse">Signing up...</span> : <span>Sign up</span>}
                    
                                </button>
                            </form>
                            <div className="relative w-full flex items-center  my-4 gap-2 opacity-10 uppercase text-black font-bold">
                                    <hr className="w-1/2 border-black"/>
                                    <hr className="w-1/2 border-black"/>
                            </div>
                            <Oauth/>
                            <p className=" text-dark-grey text-xl mt-4 text-center md:hidden">                                
                                Already a member ?
                                <button 
                                    className="underline text-black text-xl ml-1"
                                    onClick={() => dispatch(setAuthPageMode('sign-in'))}>
                                    Sign in here.
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

export default SignUp 