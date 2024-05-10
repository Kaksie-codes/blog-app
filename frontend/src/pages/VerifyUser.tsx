import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setVerificationStatus, setCredentials } from "../redux/auth/authSlice";


const VerifyUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { token, id }= useParams();
    const navigate = useNavigate();
    // const [userId, setUserId] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);
    const dispatch = useDispatch();

    const { verified } = useSelector((state:any) => state.auth)

    const resendVerificationEmail = async() => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/auth/resendVerificationMail/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const { message:statusMessage, success} = await res.json();

            if(success == false){
                setStatus(false); 
                toast.error(statusMessage);                   
            }else{
                // setUserId(userId);                    
                setStatus(true);
                toast.success(statusMessage);
            }
            setIsLoading(false);
            setStatus(status);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }
 
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`/api/auth/${id}/verify/${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                const { message:statusMessage, success, userData} = await res.json();

                
                if(success == false){
                    setStatus(false);
                    toast.error(statusMessage);                                      
                }else{
                    console.log('userData ====>>>', userData)
                    // Extract user data from response and dispatch actions to set user and authentication data
                    const { fullname, userId, username, role, verified, profileImg, email } = userData;
                    // setUserId(userId); 
                    dispatch(setCredentials({
                        profile_img: profileImg,
                        username,
                        fullname,
                        role,
                        userId,
                        email
                      }));
          
                    dispatch(setVerificationStatus(verified));                    
                    setStatus(true);
                    toast.success(statusMessage);
                    dispatch(setVerificationStatus(true));
                    dispatch(setCredentials(userData)) 
                }
                // setMessage(statusMessage);
                setStatus(status)
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        if (!verified) {
            verifyUser();
        }
    }, [])

    useEffect(() => {
        if (verified) {
            setLoading(false);
        }
    }, [verified])

  return (
    <div className="grid place-items-center h-cover">
        {
            loading ? (
                <Loader/>
            ) : (
                verified == true ? (
                    <div className="text-center">
                        <h1 className="font-gelasio text-5xl">Your Account is successfully verified</h1>
                        <button
                            onClick={() => navigate(`/settings/edit-profile`)} 
                            className="btn-dark"
                        >
                            Update your Profile
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className={`font-gelasio text-5xl`}>Your account is not verified</h1>
                        <button
                            disabled={isLoading}
                            onClick={resendVerificationEmail} 
                            className={`btn-dark ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {isLoading ? 'sending...' : 'Resend Verification Email'}   
                        </button>
                </div>
                )
                
            )
        }        
    </div>
  )
}

export default VerifyUser