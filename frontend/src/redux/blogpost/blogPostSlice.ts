import { createSlice } from "@reduxjs/toolkit";

interface Author{
    personal_info: {        
        profile_img?: string;
        username?: string;
        fullname?: string;
    }
    
}

interface BlogPostState {
    title: string, 
    banner:string, 
    content: any[], 
    tags: any[], 
    description: string,
    author: Author
}

const initialState: BlogPostState = {
    title: '', 
    banner:'', 
    content: [], 
    tags: [], 
    description: '',
    author: {
      personal_info: {}
    }
}

const blogSlice = createSlice({
    name: 'blogPost',
    initialState,
    reducers: { }
})


// export const {  } = blogSlice .actions;
export default blogSlice .reducer;