import { capitalizeFirstLetter } from '../libs/capitalizeLetter'

const Avatar = ({
    profileImg, 
    fullname, 
    username, 
    parentStyles
} : {
    profileImg: string,
    username: string,
    fullname:string,
    parentStyles: string
}) => {
  return (
    <div className={`${parentStyles}`}>
        {
            profileImg && profileImg.length ? (
                <img
                    src={profileImg} alt="profile image" className='rounded-full h-full w-full object-cover cursor-pointer'
                />
            ) : (
                fullname && fullname.length ? (
                    <div className='h-full w-full rounded-full border-[1px] border-black text-2xl font-bold flex items-center justify-center'>
                        {capitalizeFirstLetter(fullname)}
                    </div>
                ) : (
                    <div className='bg-grey h-full w-full rounded-full border-[1px] border-black text-2xl font-bold flex items-center justify-center'>
                        {capitalizeFirstLetter(username)}
                    </div>
                )
            )
        }
    </div>
  )
}

export default Avatar