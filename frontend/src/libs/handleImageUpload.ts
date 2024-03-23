import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";

export const handleImageUpload = async (
    image: File,
    setImageUploadError: any,
    setImageUploadProgress: any,
    setFormData: any,
    setBlogPost: any,
    formData: any,
    blogPost: any
 ) => {
    try {
        // Reset error
        setImageUploadError(null);

        // Check file size
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (image.size > maxSize) {
            throw new Error('Image size exceeds 2MB limit');
        }

        // Get storage reference and generate unique filename
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + image.name;
        const storageRef = ref(storage, fileName);

        // Upload image to storage
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Listen to changes in upload state
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('progress >>', Math.round(progress));
                setImageUploadProgress(Math.round(progress));
            },
            (error) => {
                // Handle upload error
                console.error("Image upload failed:", error);
                setImageUploadError('Image upload failed. Please try again later.');
            },
            () => {
                // Upload complete                    
                setImageUploadProgress(100);
            }
        );

        // Wait for the upload to complete
        await uploadTask;

        // Get download URL for the uploaded image
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update form data with image URL
        setFormData({ ...formData, image: downloadURL });
        setBlogPost({...blogPost, banner: downloadURL});

    } catch (error:any) {
        console.error("Image upload failed:", error);

        // Handle specific error cases if needed
        if (error.code === 'storage/unauthorized') {
            setImageUploadError('Unauthorized access to storage (file size must be less than 2Mb).');
        } else if (error.message === 'Image size exceeds 2MB limit') {
            setImageUploadError('Image size must be less than 2MB.');
        } else {
            setImageUploadError('Image upload failed. Please try again later.');
        }
        setImageUploadProgress(0); // Reset progress
    }
};