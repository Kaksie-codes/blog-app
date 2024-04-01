import { useState } from "react";
import InputBox from "./InputBox"
import { FormData } from "../pages/UserAuth";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setResetPageMode } from "../redux/auth/authSlice";


const SendResetOTP = ({
    email,
    setEmail
} : {
    email:string,
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { resetPageMode } = useSelector((state:any) => state.auth);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const dispatch = useDispatch();
    

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email    

    // const [email, setEmail] = useState(''); 

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
        const res = await fetch(`/api/auth/generateOTP`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email}),
        });
        
        const result = await res.json(); 
        const { success, message } = result
        if(success == false){
            toast.error(message)
        }else{
            toast.success(message);
            // setEmail('');
            setTimeout(() => {
                dispatch(setResetPageMode('verify-OTP'));
            }, 3000)            
        }
        console.log('result >>', result);
    } catch (err) {
        console.log('backend error >>', err);
        // toast.error(err?.data?.message)
    } finally {
        setIsloading(false);
    }
}

  return (
      <div className={`w-full ${resetPageMode == 'input-email' ? 'block' : 'hidden'}`}>
        <form className="w-full" >
            <h1 className="text-4xl font-gelasio capitalize text-center  mb-12">
                Forgot Password
            </h1>
            <p className="mb-5">You will receive an OTP to reset your Password</p>
            <InputBox                
                name="email"
                type='email'
                placeholder="Email"
                onChange={handleChange}
                icon="fi-rr-envelope"
                value={email}
                errorMessage={validationErrors.email}
            />                    
            <button
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                className={`btn-dark center mt-6 ${isLoading ? 'cursor-not-allowed' : ''}`}
            >
                {
                    isLoading ? <span className="animate-pulse">Sending...</span> : <span>Send OTP</span>
                }
            </button>
        </form>
    </div> 
  )
}

export default SendResetOTP