import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import GoogleIcon from '../imgs/google.png'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const Oauth = () => {
    const dispatch = useDispatch();
    const handleClick = async () => {
        try{
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
            console.log(data);
            dispatch(signInSuccess(data));
        }catch(err){
            console.log(`could'nt log in with google`, err);
        }
    }
    // ?.replace("s96-c", "s384-c")
  return (
    <button  onClick={handleClick}
    className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
        Continue with Google
        <img src={GoogleIcon} alt="google icon" className="w-5" />
    </button>
  )
}

export default Oauth