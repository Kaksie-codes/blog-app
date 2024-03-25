import { User } from '../pages/Search'
import { Link } from 'react-router-dom';

const UserCard = ({user}: {user:User}) => {
    const { username, fullname, profile_img } = user.personal_info;
  return (
    <Link to={`/users/${username}`} className='flex gap-5 items-center mb-5'>
        <img src={profile_img} alt="profile image" className='h-14 w-14 rounded-full' />
        <div>
            <h1 className='font-medium text-xl line-clamp-2'>{fullname}</h1>
            <h1 className='text-dark-grey'>@{username}</h1>
        </div>
    </Link>
  )
}

export default UserCard