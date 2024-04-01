import { createSlice } from "@reduxjs/toolkit";

export interface CurrentUser{    
    profile_img: string;
    username: string;
    fullname: string;
}

interface UserState {
    userInfo: CurrentUser | null; 
    authPageMode: string;
    resetPageMode: string;
    verified: boolean;
}

const initialState: UserState = {
    userInfo:null,
    authPageMode: 'sign-in',
    resetPageMode: 'input-email',  
    verified: false
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
        },
        setAuthPageMode: (state, action) => {
            state.authPageMode = action.payload
        },
        setResetPageMode: (state, action) => {
            state.resetPageMode = action.payload
        },
        setVerificationStatus: (state, action) => {
            state.verified = action.payload
        },
    }
})

export const { setCredentials, signOut, setAuthPageMode, setResetPageMode, setVerificationStatus } = authSlice.actions
export default authSlice.reducer