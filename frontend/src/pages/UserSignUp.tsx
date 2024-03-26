import { Link, Navigate, useNavigate } from "react-router-dom"
import InputBox from "../components/InputBox"
import AnimationWrapper from "../libs/page-animation"
import { useState } from "react"
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import Oauth from "../components/Oauth"


interface FormData {    
    username: string;
    email: string;
    password: string;
    passwordCheck:string;    
}

const UserSignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, currentUser } = useSelector((state) => state.user);
    const accessToken = currentUser ? currentUser.accessToken : null;

    const [formData, setformData] = useState({        
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
        setformData({            
            ...formData,
            [id]: value.trim()                 
        }) 
    }

    const validateForm = () => {        
        const validationErrors: Partial<FormData> = {};       
        if(!formData.username.trim()){
            validationErrors.username = 'Username is required'
        }

        if(!formData.email.trim()){
            validationErrors.email = 'Email is required'
        }else if(!emailRegex.test(formData.email)){
            validationErrors.email = 'Email is invalid'
        }

        if(!formData.password.trim()){
            validationErrors.password = 'Password is required'
        }else if(!passwordRegex.test(formData.password)){
            validationErrors.password = 'Password is invalid'
        }

        if(!formData.passwordCheck.trim()){
            validationErrors.passwordCheck = 'Password confirmation is required'
        }else if(formData.passwordCheck !== formData.password){
            validationErrors.passwordCheck = 'Passwords do not match'
        }

        setValidationErrors(validationErrors as FormData);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        validateForm();
        dispatch(signInStart());
        try{ 
            const res = await fetch(`/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to submit form');
            }

            const data = await res.json();
            // if(data.error){
            //     console.log('data error >>>', data.error);
            // }
            console.log(data);            
            dispatch(signInSuccess(data));
            navigate('/profile')          
        }catch(err){
            console.log('error >>', err);
            dispatch(signInFailure(err));
        }    
    }

  return (
    <>
        {
            accessToken ? (
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
                                value={formData.username}
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
                                value={formData.email}
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
                                value={formData.password}
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
                                value={formData.passwordCheck}
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