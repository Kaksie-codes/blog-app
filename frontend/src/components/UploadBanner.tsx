import { useEffect, useState } from 'react';
import defaultBanner from '../imgs/blog banner.png'
import { useDispatch, useSelector } from "react-redux";
import { setUploadedImage } from '../redux/blogpost/blogPostSlice';
// import { handleImageUpload } from '../libs/handleImageUpload';

const UploadBanner = () => {
    const { uploadedImage = null } = useSelector((state: any) => state.blogPost) || {};
    // const imageUrl = useSelector((state:any) => state.blogPost.imageUrl);
    const dispatch = useDispatch();
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>('Please select an image smaller than 2MB.');
    // const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
    // const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    // const [banner, setBanner] = useState();
  
   
    

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         if (file.size > 2 * 1024 * 1024) {
    //             setImageError('Please select an image smaller than 2MB.');
    //             e.target.value = '';
    //             return;
    //         }

    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             const result = event.target?.result;
    //             if (result && typeof result === 'string') {
    //                 dispatch(setImageFile(file));
    //                 dispatch(setImageUrl(result));
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setImageError('Please select an image smaller than 2MB.');
                e.target.value = '';
                return;
            }
        //   const imageUrl = URL.createObjectURL(file);
          dispatch(setUploadedImage(file));
        }
      };



    // placeholder: `Let's write an awesome story`
    // useEffect(() => {
    //     if(image){
    //         handleImageUpload(
    //             image, 
    //             setImageUploadError, 
    //             setImageUploadProgress,
    //             setFormData,
    //             setBlogPost,
    //             formData,
    //             blogPost
    //       );
    //     }else{
    //         setImageUploadError('Please select an image');
    //     }
    // }, [image])
  return (
    <div className="mx-auto max-w-[700px] w-full mt-3 ">
                    <div className="relative aspect-video hover:opacity-[80%] bg-white border-4 border-grey">
                        <label htmlFor="uploadBanner">
                            {
                                uploadedImage ? (                                    
                                    <img src={URL.createObjectURL(uploadedImage)} alt="banner image" className="z-20 cursor-pointer" />
                                ) : (
                                    <img src={defaultBanner} alt="banner image" className="z-20 cursor-pointer" />  
                                )
                            }                           
                            <input 
                                id="uploadBanner" 
                                type="file" 
                                accept=".png, .jpg, .jpeg" 
                                onChange={handleChange}
                                hidden />
                        </label>                        
                    </div>  
                    {imageError && <p className="text-center text-sm text-red">{imageError}</p>}     
                    {/* <p className="text-center text-sm">
                        {
                            imageUploadError ? (
                                <span className="text-red">{imageUploadError}</span>
                            ) : (
                                imageUploadProgress > 0 && imageUploadProgress < 100 ? (
                                <span className="text-black">{`uploading: ${imageUploadProgress} %`}</span>
                                ) : imageUploadProgress === 100 ?  (
                                    <span className="text-[#008000] ">Image Uploaded successfully</span>
                                ) : (
                                    ''
                                )
                            )
                        }                        
                    </p>              */}
                </div>
  )
}

export default UploadBanner