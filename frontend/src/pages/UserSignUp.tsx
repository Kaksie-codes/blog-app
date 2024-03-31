import { Link, Navigate, useNavigate } from "react-router-dom"
import InputBox from "../components/InputBox"
import AnimationWrapper from "../libs/page-animation"
import { useState } from "react"
import { setCredentials } from "../redux/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import Oauth from "../components/Oauth"
// import { toast } from "react-toastify"
import { toast } from "react-hot-toast"


export interface FormData {    
    username?: string;
    email?: string;
    password?: string;
    passwordCheck?:string;    
}

const UserSignUp = () => {
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
        const { value, id } = e.target;
        setSignUpData({            
            ...signUpData,
            [id]: value.trim()                 
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
                <AnimationWrapper>
                <section className="container xl:px-[5vw] h-cover flex items-center justify-center">            
                    <div className="w-[80%] max-w-[400px]">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <h1 className="text-4xl font-gelasio capitalize text-center  mb-24 ">
                                Join us today
                            </h1>                    
                            <InputBox
                                classNames={`bg-grey ${validationErrors.username ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                name="username"
                                type='text'
                                placeholder="Username"
                                id='username'
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
                                id='email'
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
                                id='password'
                                onChange={handleChange}
                                icon="fi-rr-key"
                                value={signUpData.password}
                                errorMessage={validationErrors.password}
                            />                    
                            <InputBox
                                classNames={`bg-grey ${validationErrors.passwordCheck ? 'border-[#ff3860]' : 'border-grey'} focus:bg-transparent`}
                                name="password"
                                type='password'
                                placeholder="Confirm Password"
                                id='passwordCheck'
                                onChange={handleChange}
                                icon="fi-rr-key"
                                value={signUpData.passwordCheck}
                                errorMessage={validationErrors.passwordCheck}
                            />                         
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-dark center mt-14"                        
                            >
                                {isLoading ? <span  className="animate-pulse">Signing up...</span> : <span>Sign up</span>}
                                
                            </button>                                       
                        </form>
                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                                <hr className="w-1/2 border-black"/>
                                <hr className="w-1/2 border-black"/>
                            </div>
                            <Oauth/>
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member ?
                                <Link to={'/signin'} className="underline text-black text-xl ml-1">
                                    Sign in here.
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

export default UserSignUp