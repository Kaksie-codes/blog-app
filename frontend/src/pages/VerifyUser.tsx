import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setVerificationStatus } from "../redux/auth/authSlice";


const VerifyUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { token }= useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);
    const dispatch = useDispatch();

    const { verified } = useSelector((state:any) => state.auth)

    const resendVerificationEmail = async() => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/auth/resendVerificationMail`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const { message:statusMessage, userId, success} = await res.json();

            if(success == false){
                setStatus(false); 
                toast.error(statusMessage);                   
            }else{
                setUserId(userId);                    
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
                const res = await fetch(`/api/auth/verifyUser?token=${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                const { message:statusMessage, userId, success} = await res.json();

                if(success == false){
                    setStatus(false);
                    toast.error(statusMessage);
                    dispatch(setVerificationStatus(true));                   
                }else{
                    setUserId(userId);                    
                    setStatus(true);
                    toast.success(statusMessage);
                }
                // setMessage(statusMessage);
                setStatus(status)
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        verifyUser();
    }, [])
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
                            onClick={() => navigate(`/users/${userId}`)} 
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