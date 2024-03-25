import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import AboutUser from "../components/AboutUser";

interface UserProfile {
  account_info:{
    total_posts: number,
    total_reads: number,
  },
  joinedAt:string,
  personal_info: {
    fullname: string;
    profile_img: string;
    username: string;
    bio:string
  };
  social_links:{
    youtube:string,
    instagram:string,
    facebook:string,
    twitter:string
  }  
}

const userProfile = {
  account_info:{
    total_posts: 0,
    total_reads: 0,
  },
  joinedAt: '',
  personal_info: {
    fullname: '',
    profile_img: '',
    username: '',
    bio: ''
  },
  social_links:{
    youtube: '',
    instagram:'',
    facebook: '',
    twitter: ''
  }  
}

const Profile = () => {
  const { currentUser: {username} } = useSelector((state:any) => state.user);  
  const { id:profileId } = useParams();
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [loading, setLoading] = useState(true);

  const { fullname:name, username:profile_username, profile_img, bio }  = profile.personal_info
  const {total_reads, total_posts }  = profile.account_info
  const { social_links , joinedAt }  = profile

  const getProfile = async() => {
    try{
      const res = await fetch('/api/users/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profileId })
      })
      const { user } = await res.json();
      setProfile(user);
      setLoading(false)
      console.log('user >>', user);
    }catch(error){
      console.log('error >>', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <AnimationWrapper>
      {
        loading ? (
          <Loader/>
        ) : (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
              <img src={profile_img} alt="profile image" className="rounded-full w-48 h-48 bg-grey md:w-32 md:h-32" />
              <h1 className="text-2xl font-medium">@{profile_username}</h1>
              <p className="text-xl capitalize h-6">{name}</p>
              <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
              <div>
                {
                  username === profile_username ? (
                    <Link to='/setting/edit-profile' className="btn-light rounded-md">
                      Edit Profile
                    </Link>
                  ) :(
                    null
                  )
                }                
              </div>
              <AboutUser classNames='max-md:hidden' bio={bio} joinedAt={joinedAt} social_links={social_links}/>
            </div>
            Profile { name }
          </section>
        )
      }
     
    </AnimationWrapper>
  )
}

export default Profile