import { useState } from "react";
import { FormData } from "../pages/UserAuth";
import InputBox from "./InputBox"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setAuthPageMode } from "../redux/auth/authSlice";


const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(false)

    const { resetPageMode } = useSelector((state:any) => state.auth);
    const [resetPasswordData, setResetPasswordData] = useState({
        password:"", 
        passwordCheck:""});     

    const [validationErrors, setValidationErrors] = useState<FormData>({        
        username: "", 
        email:"", 
        password:"", 
        passwordCheck:""});
    
    
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleChange = (e:any) => {        
        const { value, name } = e.target;
        setResetPasswordData({            
            ...resetPasswordData,
            [name]: value.trim()                 
        }) 
    }

    const validateForm = () => {
        const validationErrors: Partial<FormData> = {};     
        
        if(!resetPasswordData.password.trim()){
            validationErrors.password = 'Password is required'
        }else if(!passwordRegex.test(resetPasswordData.password)){
            validationErrors.password = 'Password should contain an Uppercase, a lower'
        }

        if(!resetPasswordData.passwordCheck.trim()){
            validationErrors.passwordCheck = 'Password confirmation is required'
        }else if(resetPasswordData.passwordCheck !== resetPasswordData.password){
            validationErrors.passwordCheck = 'Passwords do not match'
        }

        setValidationErrors(validationErrors as FormData);

         // If there are any validation errors, return false
         return Object.keys(validationErrors).length === 0;
    }
   

    const changePassword = async (e:React.FormEvent) => {
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
            const res = await fetch(`/api/auth/resetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({newPassword:resetPasswordData.password}),
            });
            const result = await res.json(); 
            const { success, message } = result;
            if(success == false){
                toast.error(message);
                setIsloading(false);
            }else{
                toast.success(message);
                setTimeout(() => {
                    navigate('/auth');
                    dispatch(setAuthPageMode('sign-in'));
                }, 3000);                
            }                  
        }catch(err){
            console.log('error >>', err);
            setIsloading(false);
        }    
    }
   
  return (
    <form 
        className={`w-full md:min-w-[400px] ${resetPageMode == 'reset-password' ? 'block' : 'hidden'}`} onSubmit={changePassword}>
        <h1 className="text-2xl md:text-4xl mb-3 font-gelasio capitalize text-center">
            Reset Password
        </h1>
        <InputBox            
            name="password"
            type='password'
            placeholder="New Password"                                    
            onChange={handleChange}
            icon="fi-rr-key"
            value={resetPasswordData.password}
            errorMessage={validationErrors.password}
        />
        <InputBox            
            name="passwordCheck"
            type='password'
            placeholder="Confirm New Password"                                    
            onChange={handleChange}
            icon="fi-rr-key"
            value={resetPasswordData.passwordCheck}
            errorMessage={validationErrors.passwordCheck}
        />
        <button
            type="submit"
            disabled={isLoading}
            className="btn-dark center mt-3"
        >
            {isLoading ? <span  className="animate-pulse">Resetting...</span> : <span>Reset</span>}                    
        </button>
    </form>
  )
}

export default ResetPassword