import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Link from '@editorjs/link'
// import uploadImage from '../libs/handleImageUpload'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'

const uploadImage = async (file:File) => {
    try{
        // Get storage reference and generate unique filename
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);

      // Upload image to storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Wait for the upload to complete
      await uploadTask;

      // Get download URL for the uploaded image
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at", downloadURL);

      return downloadURL
    }catch(error){
        console.error("Image upload failed:", error);
    }
}

const uploadImageByFile = (imageUrl:File) => {
    
        return uploadImage(imageUrl,).then(url => {
            console.log('URL >>>>', url)
            if(url){
                return {
                    success: 1,
                    file: { url: imageUrl }
                };
            }
        })        
    
}

const uploadImageByUrl = (e:any) => {
    let link = new Promise((resolve, reject) => {
        try{
            resolve(e)
        }catch(err){
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config:{
            uploader:{
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile,
            }            
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading...",
            levels: [2,3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode,
    link: Link
}