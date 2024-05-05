import { useState } from "react";
import InputBox from "../components/InputBox"
import AnimationWrapper from "../libs/page-animation"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthPageMode, signOut } from "../redux/auth/authSlice";

interface PasswordData {
    currentPassword: string, 
    newPassword: string, 
    confirmNewPassword: string, 
}

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(false);
    const [passwordData, setPasswordData] = useState({        
        currentPassword: "", 
        newPassword:"", 
        confirmNewPassword:"", 
    });  

    const [validationErrors, setValidationErrors] = useState<PasswordData>({        
        currentPassword: "", 
        newPassword:"", 
        confirmNewPassword:"", 
    });

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const validateForm = () => {
        const validationErrors: Partial<PasswordData> = {}; 

        if(!passwordData.currentPassword.trim()){
            validationErrors.currentPassword = 'Current Password is required'
        }

        if(!passwordData.newPassword.trim()){
            validationErrors.newPassword = 'New Password is required'
        }else if(!passwordRegex.test(passwordData.newPassword)){
            validationErrors.newPassword = 'Password should contain an Uppercase, a lower'
        }

        if(!passwordData.confirmNewPassword.trim()){
            validationErrors.confirmNewPassword = 'Password confirmation is required'
        }else if(passwordData.confirmNewPassword !== passwordData.newPassword){
            validationErrors.confirmNewPassword = 'Passwords do not match'
        }

        setValidationErrors(validationErrors as PasswordData);

         // If there are any validation errors, return false
         return Object.keys(validationErrors).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {        
        const { value, name } = e.target;
        setPasswordData({            
            ...passwordData,
            [name]: value.trim()                 
        }) 
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setIsloading(true);
        try{ 
            const {currentPassword, newPassword} = passwordData
            const res = await fetch(`/api/auth/changePassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({currentPassword, newPassword}),
            });
            const result = await res.json(); 
            const { success, message } = result          
            // console.log('user >>', user); 
            if(success == false){
                toast.error(message);
                setIsloading(false); 
            }else{
                toast.success(message)                
                setIsloading(false);
                setPasswordData({
                    currentPassword: '', 
                    newPassword:'', 
                    confirmNewPassword: ''
                })   
                setTimeout(() => {                      
                    dispatch(setAuthPageMode('sign-in'));
                    dispatch(signOut())
                    navigate('/auth')
                }, 3000)                
            }     
        }catch(err){
            console.log('error >>', err);
            setIsloading(false);
        } 
    }

  return (
    <AnimationWrapper>
        <form onSubmit={handleSubmit}>
            <h1 className="max-md:hidden">
                Change Password
            </h1>
            <div className="py-10 w-full md:max-w-[400px]">
                <InputBox
                    name="currentPassword"
                    type='password'
                    placeholder="Current Password"
                    icon="fi fi-rr-unlock"
                    onChange={handleChange}
                    value={passwordData.currentPassword}
                    errorMessage={validationErrors.currentPassword}
                />
                <InputBox
                    name="newPassword"
                    type='password'
                    placeholder="New Password"
                    icon="fi fi-rr-unlock"
                    onChange={handleChange}
                    value={passwordData.newPassword}
                    errorMessage={validationErrors.newPassword}
                />
                <InputBox
                    name="confirmNewPassword"
                    type='password'
                    placeholder="Confirm New Password"
                    icon="fi fi-rr-unlock"
                    onChange={handleChange}
                    value={passwordData.confirmNewPassword}
                    errorMessage={validationErrors.confirmNewPassword}
                />
                <button                     
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} btn-dark px-10  mt-3`}
                >
                    {isLoading ? <span  className="animate-pulse">Changing Password...</span> : <span>Change Password</span>}                    
                </button>
            </div>
        </form>        
    </AnimationWrapper>
  )
}

export default ChangePassword