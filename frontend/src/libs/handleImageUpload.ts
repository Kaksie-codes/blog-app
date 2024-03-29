import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { setUploadError, setUploadProgress, setBanner,  } from "../redux/blogpost/blogPostSlice";


const uploadImage = async (file: File, dispatch: any) => {
    try {
      // Check file size
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        dispatch(setUploadError('Image size exceeds 2MB limit'));
        return; // Stop execution if file size exceeds limit
      }

      // Get storage reference and generate unique filename
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);

      // Upload image to storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen to changes in upload state
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('progress >>', Math.round(progress));
          dispatch(setUploadProgress(Math.round(progress)));
        },
        (error) => {
          // Handle upload error
          console.error("Image upload failed:", error);
          dispatch(setUploadError('Image upload failed. Please try again later.'));
        },
        () => {
          // Upload complete 
          dispatch(setUploadProgress(100));
          dispatch(setUploadError(null));
        }
      );

      // Wait for the upload to complete
      await uploadTask;

      // Get download URL for the uploaded image
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at", downloadURL);

      // Update form data with image URL
      dispatch(setBanner(downloadURL));
    //   console.log("banner  >>", banner);
    } catch (error:any) {
      console.error("Image upload failed:", error);

      // Handle specific error cases if needed
      if (error.code === 'storage/unauthorized') {
        dispatch(setUploadError('Unauthorized access to storage (file size must be less than 2Mb).'));
      } else if (error.message === 'Image size exceeds 2MB limit') {
        dispatch(setUploadError('Image size must be less than 2MB.'));
      } else {
        dispatch(setUploadError('Image upload failed. Please try again later.'));
      }
      dispatch(setUploadError(0));
    }
};

export default uploadImage;
