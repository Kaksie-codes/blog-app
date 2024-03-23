import { Link } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation"
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice"


const UserNavigation = () => {
    const dispatch = useDispatch();    
    const { currentUser: {username} } = useSelector((state) => state.user);

    const signOutUser = async () => {
        try{
            await fetch('/api/auth/signout');
            dispatch(signoutSuccess());
        }catch(err){
            
            console.log('error >>', err)
        }
    }

  return (
    <AnimationWrapper 
        transition={{duration: 0.2,}}
        className="absolute right-0 z-50 ">
        <div className="bg-white absolute right-0 duration-200 border border-grey w-60">
            <Link to={'/editor'} className="flex gap-2 link md:hidden pl-8 py-4">
                <i className="fi fi-rr-file-edit "></i>
                <p>Write</p>
            </Link>
            <Link to={`/user/${username}`} className="link pl-8 py-4">
                Profile
            </Link>
            <Link to={`/dashboard/blogs`} className="link pl-8 py-4">
                Dashboard
            </Link>
            <Link to={`/settings/edit-profile`} className="link pl-8 py-4">
                Settings
            </Link>
            <span className="absolute border-t border-grey w-full"/>
            <button 
                onClick={signOutUser}
                className="text-left p-4 hover:bg-grey w-full pl-8 py-4">
                <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                <p className="text-dark-grey">@{username}</p>
            </button>
            
        </div>
    </AnimationWrapper>
  )
}

export default UserNavigation