import { useEffect, useState } from 'react';
import defaultBanner from '../imgs/blog banner.png'
import { useDispatch, useSelector } from "react-redux";
import { setUploadError, setBanner } from '../redux/blogpost/blogPostSlice';
// import { getStorage, ref } from "firebase/storage"
// import { deleteObject } from "firebase/storage";
import uploadImage from '../libs/handleImageUpload';
import Loader from './Loader';

const UploadBanner = () => {
    const { banner, uploadProgress, uploadError } = useSelector((state: any) => state.blogPost) || {};
    // const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();    
    const [image, setImage] = useState<File | null>(null); 


const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
        // If banner is not empty, delete the existing banner from Firebase storage
        if (banner) {
            // const storage = getStorage();
            // const bannerRef = ref(storage, banner);
            // try {
            //     await deleteObject(bannerRef);
            //     console.log('Banner deleted successfully');
            // } catch (error) {
            //     console.error('Error deleting banner:', error);
            // }
            // // Set the banner in Redux store to an empty string
            dispatch(setBanner(''));
        }
        setImage(file);
        // uploadImage(file, dispatch); 
    }
};


 
      useEffect(() => {
        if (image) {
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (image.size > maxSize) {
                dispatch(setUploadError('Please select an image smaller than 2MB.'));
                dispatch(setBanner(null));
                return;
            } 
            dispatch(setUploadError('Uploading...'));       
            uploadImage(image, dispatch); // Dispatch the uploadImage action
            dispatch(setUploadError(null));
        } else {
            if(banner){
                dispatch(setUploadError(null));
            }else{
                dispatch(setUploadError('Please select an image'));
            }            
        }
    }, [image, dispatch]); // Make sure to include dispatch in the dependency array

  return (
    <div className="mx-auto max-w-[700px] w-full mt-3 ">
        <div className="relative aspect-video hover:opacity-[80%] bg-white border-4 border-grey">
            <label htmlFor="uploadBanner">
                {
                    banner == null ? (         
                            <img src={defaultBanner} alt="banner image" className="z-20 cursor-pointer"/>
                    ) : (
                        <div className='w-full h-full '>
                            {
                                banner.length ? (
                                    <img src={banner} alt="banner image" className="z-20 cursor-pointer" />
                                ) : (
                                    <div className='relative'>
                                    <div className='absolute top-[50%] left-[50%] -translate-x-[50%] '>
                                        <Loader/>
                                        <span className='animate-pulse mt-1'>Loading...</span>
                                    </div>
                                    <img src={defaultBanner} alt="banner image" className="z-20 cursor-pointer"/>
                                </div>
                                )
                            }                           
                        </div>
                    )
                }                           
                    <input 
                        id="uploadBanner" 
                        type="file" 
                        accept=".png, .jpg, .jpeg" 
                        onChange={handleChange}
                        hidden 
                    />
            </label>                        
        </div>
        <p className="text-center text-sm">
            {
                uploadError ? (
                    <span className="text-red">{uploadError}</span>
                ) : (
                    uploadProgress > 0 && uploadProgress < 100 ? (
                        <span className="text-black">{`uploading: ${uploadProgress} %`}</span>
                        ) : uploadProgress === 100  ?   (
                            <span className="text-[#008000] ">Image Uploaded successfully</span>
                        ) : (
                        ''
                    )
                )
            }                        
        </p>             
    </div>
  )
}

export default UploadBanner