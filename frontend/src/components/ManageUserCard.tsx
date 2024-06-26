import { Link } from "react-router-dom";
import { User } from "../pages/ManageUsers";
import { getTime } from "../libs/date";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { PaginationStats } from "../pages/Home";


const ManageUserCard = ({ 
    data,   
    state,
    setState,
    count,
    setCount,
    index
} : { 
    data: User, 
    count:PaginationStats,   
    state: User[],
    setCount:any
    setState:any,
    index:number,
    getAllUsers:(page:number, activeFilter:string) => void,
}) => { 
    const {personal_info:{profile_img, username, fullname}, joinedAt, verified, role, _id:userId} = data;

        
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/users/delete-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ userId })               
            });
            const { message, success } = await res.json(); 
            if(success){
                toast.success(message);
                const newState = [...state];
                newState.splice(index, 1);
                setState(newState);   
                setCount({...count, totalCount: count.totalCount - 1 })             
            }else{
                toast.error(message);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

  return (
    <div className="flex p-3 lg:p-6 border-b border-grey max-w-[600px]">
        <div className="flex  gap-5 justify-between  items-start w-full">
            <img
                src={profile_img}
                alt="profile image"
                className="w-16 h-16 rounded-full "
            />            
            <div className="flex flex-col md:flex-row justify-between gap-3 flex-1">
                <div className="flex flex-col">
                    <span className="capitalize flex items-center justify-start gap-1 font-medium text-xl text-dark-grey">
                        {fullname}
                        {verified && <FaCheckCircle className="text-blue-500" />}
                    </span>
                    <Link to={`/users/${username}`} className="mx-1 text-black underline font-medium text-base">
                        @{username}
                    </Link>
                    <p className="mt-4">joined {getTime(joinedAt)}</p>
                </div>
                <div className="flex items-start gap-4">
                    {
                        role == 'admin' && (
                            <div className="border bg-blue-500 text-white p-2 rounded-md cursor-pointer">
                                <p>{role == 'admin' ? 'Admin' : null}</p>
                            </div>
                        )
                    }
                    <div className="border border-red p-2 text-left rounded-md cursor-pointer">
                        <p
                            className="text-red"
                            onClick={handleDelete}
                        >Delete</p>
                    </div>
                </div>
            </div>           
        </div>
        
    </div>
  )
}

export default ManageUserCard