import { useEffect, useState } from 'react';
import defaultBanner from '../imgs/blog banner.png'
import { handleImageUpload } from '../libs/handleImageUpload';

const UploadBanner = ({
    banner, 
    formData, 
    setFormData, 
    setBlogPost, 
    blogPost
} : {
    banner: string,
    formData: any,
    setFormData: any,
    setBlogPost: any,
    blogPost: any
}) => {
    const [image, setImage] = useState(undefined);
    const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const handleChange = (e:any) => {        
        let image = e.target.files[0];
        console.log(image);
        setImage(image)
    }

    // placeholder: `Let's write an awesome story`
    useEffect(() => {
        if(image){
            handleImageUpload(
                image, 
                setImageUploadError, 
                setImageUploadProgress,
                setFormData,
                setBlogPost,
                formData,
                blogPost
          );
        }else{
            setImageUploadError('Please select an image');
        }
    }, [image])
  return (
    <div className="mx-auto max-w-[900px] w-full ">
                    <div className="relative aspect-video hover:opacity-[80%] bg-white border-4 border-grey">
                        <label htmlFor="uploadBanner">
                            {
                                banner ? (
                                    // <img src={formData.image} alt="banner image" className="z-20 cursor-pointer" />
                                    <img src={banner} alt="banner image" className="z-20 cursor-pointer" />
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
                    <p className="text-center text-sm">
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
                    </p>             
                </div>
  )
}

export default UploadBanner