import { createSlice } from "@reduxjs/toolkit";


interface BlogPostState {
    title: string;    
    uploadedImage : File | null; 
    banner:string;
    content: string[];
    tags: string[]; 
    description: string;
    editorMode: string; 
    draft:boolean;
}

const initialState: BlogPostState = {
    title: '', 
    uploadedImage : null,
    banner:'', 
    content: [], 
    tags: [], 
    description: '', 
    editorMode: 'editor' ,
    draft: false,  
}

const blogSlice = createSlice({
    name: 'blogPost',
    initialState,
    reducers: {         
        setBlogTitle: (state, action) => {
            state.title = action.payload;
        },
        setEditorMode: (state, action) => {
            state.editorMode = action.payload;
        },
        setBanner: (state, action) => {
            state.banner = action.payload;
        },
        setBlogContent: (state, action) => {
            state.content = action.payload;
        },
        setBlogDescription: (state, action) => {
            state.description = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        setDraft: (state, action) => {
            state.draft = action.payload;
        },
        setUploadedImage: (state, action) => {
            state.uploadedImage = action.payload;
        },        
    }
})


export const { 
    setUploadedImage, 
    setBlogTitle, 
    setBlogContent, 
    setBlogDescription,
    setTags,
    setEditorMode,
    setBanner,
    setDraft
 } = blogSlice .actions;
export default blogSlice .reducer;