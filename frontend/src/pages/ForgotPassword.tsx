import { Link, Navigate } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation"
import { useSelector } from "react-redux";
import InputBox from "../components/InputBox";
import { useState } from "react";
import { FormData } from "./UserSignUp";


const ForgotPassword = () => {
    const { userInfo } = useSelector((state:any) => state.auth);
    const [isLoading, setIsloading] = useState<boolean>(false);

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email    

    const [email, setEmail] = useState(''); 

    const [validationErrors, setValidationErrors] = useState<FormData>({        
        email:""             
    })   

    const handleChange = (e:any) => {        
        const { value } = e.target;
        setEmail(value.trim());
    }

    const validateForm = () => {
        const validationErrors: Partial<FormData> = {};
        
        if (!email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            validationErrors.email = 'Email is invalid';
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
        const res = await fetch(`/api/auth/resetPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email}),
        });
        const result = await res.json(); 
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
                            Forgot Password
                        </h1>                    
                        <InputBox
                            classNames={`bg-grey border-grey focus:bg-transparent`}
                            name="email"
                            type='email'
                            placeholder="Email"
                            id='email'
                            onChange={handleChange}
                            icon="fi-rr-envelope"
                            value={email}
                            errorMessage={validationErrors.email}
                        />
                        
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={isLoading}
                            className={`btn-dark center mt-14 ${isLoading ? 'cursor-not-allowed' : ''}`}                        
                        >                        
                            {
                                isLoading ? <span className="animate-pulse">Resetting Password...</span> : <span>Reset Password</span>
                            }
                        </button>                                       
                    </form>
                    </div>
            </section>
        </AnimationWrapper>
        )
    }
</> 
  )
}

export default ForgotPassword