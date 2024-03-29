import { createSlice } from "@reduxjs/toolkit";

interface BlogPostState {
    title: string; 
    banner:string | null;
    content: string[];
    tags: string[]; 
    description: string;
    editorMode: string; 
    draft:boolean;
    uploadProgress: number;
    uploadError: string | null
}

const initialState: BlogPostState = {
    title: '',    
    banner: null, 
    content: [], 
    tags: [], 
    description: '', 
    editorMode: 'editor' ,
    draft: false, 
    uploadProgress: 0,
    uploadError: null
}

const blogSlice = createSlice({
    name: 'blogPost',
    initialState,
    reducers: {         
        setBlogTitle: (state, action) => {
            state.title = action.payload;
        },
        setUploadError: (state, action) => {
            state.uploadError = action.payload;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
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
    }
})


export const {    
    setBlogTitle, 
    setBlogContent, 
    setBlogDescription,
    setTags,
    setEditorMode,
    setBanner,
    setDraft,
    setUploadError,
    setUploadProgress
 } = blogSlice .actions;
export default blogSlice .reducer;