import { Link, Navigate } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation"
import { useSelector } from "react-redux";
import VerifyOTP from "../components/VerifyOTP";
import logo from '../imgs/logo.png' 
import SendResetOTP from "../components/SendResetOTP";
import { useState } from "react";
import ResetPassword from "../components/ResetPassword";



const ForgotPassword = () => {
    const { userInfo } = useSelector((state:any) => state.auth);
    const [email, setEmail] = useState(''); 

    function hideEmail(email: string) {
        // Split the email into username and domain
        const [username, domain] = email.split('@');
    
        // Ensure the username length is at least 2 characters
        if (username.length < 2) {
            return email; // Return the original email if the username is too short
        }
    
        // Get the first and last characters of the username
        const firstChar = username.charAt(0);
        const lastChar = username.charAt(username.length - 1);
    
        // Replace characters between the first and last characters with asterisks
        const maskedUsername = firstChar + '*'.repeat(username.length - 2) + lastChar;
    
        // Combine the masked username and domain
        const maskedEmail = maskedUsername + '@' + domain;
        return maskedEmail;
    }
    
    const maskedEmail = hideEmail(email);
    

  return (
    <>
    {
        userInfo ? (
            <Navigate to={'/'}/>
        ) : (
            <AnimationWrapper>
            <section className="grid place-items-center bg-grey min-h-screen"> 
                <Link to={'/'} className='flex items-center justify-center gap-1 fixed top-3 left-6'>
                    <img src={logo} alt="logo"  className='flex-none w-6 lg:w-10'/>
                    <p className='font-bold text-xl lg:text-2xl'>enBlogg</p>
                </Link>           
                <div className="h-auto bg-white w-auto relative overflow-hidden p-[1rem]  md:p-[3rem] rounded-[20px] shadow-lg">
                    <SendResetOTP email={email} setEmail={setEmail}/>
                    <VerifyOTP otpLength={4} email={email} maskedEmail={maskedEmail}/>
                    <ResetPassword/>
                </div>
            </section>
        </AnimationWrapper>
        )
    }
</> 
  )
}

export default ForgotPassword