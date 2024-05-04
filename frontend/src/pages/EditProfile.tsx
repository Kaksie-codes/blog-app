import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { UserProfile, userProfile } from "./Profile";
import { useEffect, useRef, useState } from "react";
import AnimationWrapper from "../libs/page-animation";
import Loader from "../components/Loader";
import InputBox from "../components/InputBox";
import toast from "react-hot-toast";

interface ProfileData {
    username: string, 
    fullname: string, 
    bio: string, 
    facebook: string,
    github: string,
    instagram: string,
    twitter: string,
    website: string,
    youtube: string
}

const EditProfile = () => {
    const { userInfo: {username} } = useSelector((state:any) => state.auth); 
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    let profileImageRef = useRef<HTMLImageElement>(null);
    const [updatedProfileImg, setUpdatedProfileImg] = useState<File | null>(null); 
    const [imageUploading, setImageUploading] = useState(false);   
    
    const bioLimit = 300;
    const [charactersLeft, setCharactersLimit] = useState(bioLimit);

    const { personal_info: { fullname, username:profile_username, profile_img, bio, email }}  = profile
    const { social_links }  = profile;
    const { facebook, github, instagram, twitter, website, youtube } = social_links;

    
   // Ensure profileData state is set correctly
    const [profileData, setProfileData] = useState<ProfileData>({
        username: '', 
        fullname: '', 
        bio: '',
        facebook: '',
        github: '',
        instagram: '',
        twitter: '',
        website: '',
        youtube: ''
    });

    useEffect(() => {
        setProfileData({
            ...profileData,
            username:profile_username,
            fullname,
            bio,
            facebook,
            github,
            instagram,
            twitter,
            website,
            youtube
        })
    }, [profile])

  
    const handleChange = (e:any) => {        
        const { value, name } = e.target;
        setProfileData({            
            ...profileData,
            [name]: value                 
        }) 

        if(name === 'bio'){
            setCharactersLimit(bioLimit - e.target.value.length)
        }
    }

    

    const handleImagePreview = (e:any) => {
        let img = e.target.files[0];
        if(profileImageRef.current){
            profileImageRef.current.src = URL.createObjectURL(img);
        }
        setUpdatedProfileImg(img);        
    }

    const handleImageUpload = async(e:any) => {
        e.preventDefault();
        try{
            if(updatedProfileImg){
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (updatedProfileImg.size > maxSize) {
                    toast.error('Please select an image smaller than 2MB.');                
                    return;
                }                 
                setImageUploading(true);  
    
                 // Get storage reference and generate unique filename
                const storage = getStorage(app);
                const fileName = new Date().getTime() + '-' + updatedProfileImg.name; 
                const storageRef = ref(storage, fileName);
    
                // Upload image to storage
                const uploadTask = uploadBytesResumable(storageRef, updatedProfileImg);

                 // Listen to changes in upload state
                uploadTask.on('state_changed',
                (snapshot) => {
                    // Get upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('progress >>', Math.round(progress));
                },
                (error) => {
                    // Handle upload error
                    console.error("Image upload failed:", error);
                    toast.error('Image upload failed. Please try again later.');
                },
                () => {
                    // Upload complete 
                    // toast.success('Profile picture updated successfully')                   
                }
                );
    
                // Wait for the upload to complete
                await uploadTask;
    
                // Get download URL for the uploaded image
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("File available at", downloadURL);
                if(downloadURL){
                    const res = await fetch(`/api/post/update-profile-img`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: downloadURL }),
                    });
                    const result = await res.json(); 
                    const { success, message } = result          
                    // console.log('user >>', user); 
                    if(success == false){
                        toast.error(message);
                        setImageUploading(false);                         
                    }else{
                        toast.success(message)                
                        setImageUploading(false); 
                        setUpdatedProfileImg(null);                        
                    }     
                }  
            }else{
                toast.error('No image selected')
            }
        }catch(error:any){
            console.error("Image upload failed:", error);
            toast.error(error.message);

            // Handle specific error cases if needed
            if (error.code === 'storage/unauthorized') {
                toast.error('Unauthorized access to storage (file size must be less than 2Mb).');
            } else if (error.message === 'Image size exceeds 2MB limit') {
                toast.error('Image size must be less than 2MB.');
            } else {
                toast.error('Image upload failed. Please try again later.');
            }
            setImageUploading(false); 
        } 
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const {bio, fullname, username, github, facebook, twitter, website, instagram, youtube } = profileData;
        if(!fullname){
            return toast.error('Please provide fullname')
        }
        if(!username){
            return toast.error('Please provide username')
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio should not be more than ${bioLimit}`)
        }

        try {
            const res = await fetch(`/api/post/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({                    
                    fullname,
                    username,
                    bio,
                    social_links: {
                        github,
                        facebook,
                        twitter,
                        website,
                        instagram,
                        youtube
                    }
                }),
            });
            const result = await res.json(); 
            const { success, message } = result          
            // console.log('user >>', user); 
            if(success == false){
                toast.error(message);
                setUpdating(false);                         
            }else{
                toast.success(message)                
                setUpdating(false);                                       
            }     
        } catch (error:any) {
            toast.error(error.message);
        }
    }

    const getProfile = async() => {
        try{
          const res = await fetch('/api/users/get-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
          })
          const { user } = await res.json();
          if(user != null){
            setProfile(user);                
          }  
          setLoading(false)      
        }catch(error:any){
            toast.error(error.message)
          console.log('error >>', error)
          setLoading(false)
        }
      }

    useEffect(() => {
        getProfile();
    }, [])

  return (
    <AnimationWrapper>
        {
            loading ? (
                <Loader/>
            ) : (
                <form>
                    <h1 className="max-md:hidden">Edit Profile</h1>
                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        <div className="max-lg:center mb-5">
                            <label htmlFor="uploadImg" 
                                id="profileImgLabel"
                                className="relative  w-48 h-48 bg-grey rounded-full overflow-hidden flex items-center justify-center"
                            >
                                <img src={profile_img} alt="profile image" ref={profileImageRef} />
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/50 opacity-0 hover:opacity-100 cursor-pointer">
                                    Upload Image
                                </div>
                            </label>
                            <input type="file" 
                                id="uploadImg" 
                                accept=".jpeg, .png, .jpg" 
                                onChange={handleImagePreview}
                                hidden
                            />                           
                            <button 
                                className={`btn-light mt-5 max-lg:center lg:w-full px-10 ${imageUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={imageUploading}
                                onClick={handleImageUpload}
                            >                                
                                {imageUploading ? <span  className="animate-pulse">Uploading...</span> : <span>Upload</span>}                    
                            </button>
                        </div>
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox
                                        placeholder="Email"
                                        type='text'
                                        name="email"                                        
                                        value={email}
                                        disabled={true}                                            
                                        icon="fi-rr-envelope"
                                        onChange={handleChange}
                                    />
                                </div> 
                                <div>
                                    <InputBox
                                        placeholder="Full Name"
                                        type='text'
                                        name="fullname"                                        
                                        value={profileData.fullname}                                        
                                        icon="fi-rr-user"
                                        onChange={handleChange}
                                    />
                                </div>                                
                            </div>                            
                            <InputBox
                                placeholder="Username"
                                type='text'
                                name="username" 
                                value={profileData.username}                                
                                icon="fi-rr-at"
                                onChange={handleChange}
                            />
                            <p className="text-dark-grey -mt-3">
                                Username will be used to search user and will be visible to all users.
                            </p>
                            <textarea 
                                name="bio"                                
                                value={profileData.bio}
                                maxLength={bioLimit}
                                onChange={handleChange}
                                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                                placeholder="Bio"
                            ></textarea>
                            <p className="mt-1 text-dark-grey">
                                {charactersLeft} characters left
                            </p>
                            <p className="my-6 text-dark-grey">
                                Add your Social handles below
                            </p>                     
                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(social_links).map((key, index) => {
                                        // let link = social_links[key as keyof typeof social_links];
                                        return (
                                            <InputBox
                                                key={index}
                                                name={key}
                                                type='text'
                                                value={profileData[key as keyof ProfileData]}
                                                placeholder="https://"
                                                icon={`fi ${key != 'website' ? `fi-brands-${key}` : 'fi-sr-globe'}`}
                                                onChange={handleChange}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <button 
                                onClick={handleSubmit}                                
                                className={`btn-dark w-auto px-10 ${updating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={updating}
                            >
                                {updating ? <span  className="animate-pulse">Updating...</span> : <span>Update</span>}
                            </button>
                        </div>
                    </div>
                </form>
            )
        }
        
    </AnimationWrapper>
  )
}

export default EditProfile