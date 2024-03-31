import { createSlice } from "@reduxjs/toolkit";

export interface CurrentUser{    
    profile_img: string;
    username: string;
    fullname: string;
}

interface UserState {
    userInfo: CurrentUser | null; 
    isLoading: boolean;
    error: null | string; 
}

const initialState: UserState = {
    userInfo:null,
    isLoading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
        },
        signOut: (state) => {
            state.userInfo = null;
        }
    }
})

export const { setCredentials, signOut } = authSlice.actions
export default authSlice.reducer