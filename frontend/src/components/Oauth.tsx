import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import GoogleIcon from '../imgs/google.png'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';

import { setCredentials } from '../redux/auth/authSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Oauth = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState<boolean>(false); 

    const handleClick = async () => { 
        try{
            setIsloading(true);
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider); 
            const res = await fetch(`/api/auth/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })
            const data = await res.json();
            const { user, success, message} = data
            if(!success){
                toast.error(message);
            }else{
                toast.success(message);
                setTimeout(() => {
                    dispatch(setCredentials(user));
                }, 3000)
            }            
        }catch(err){
            console.log(`could'nt log in with google`, err);            
        }finally{
            setIsloading(false);
        }
    }
    // ?.replace("s96-c", "s384-c")
  return (
    <button
        disabled={isLoading}  
        onClick={handleClick}
        className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} btn-dark flex items-center justify-center gap-4 w-[90%] center"`}>
         {isLoading ? 'Signing In...' : 'Continue with Google'}
        <img src={GoogleIcon} alt="google icon" className="w-5" />
    </button>
  )
}

export default Oauth