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
    newNotificationAvailable: boolean;
}

const initialState: UserState = {
    userInfo:null,
    authPageMode: 'sign-in',
    resetPageMode: 'input-email',  
    verified: false,
    newNotificationAvailable: false,
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
        setNotificationStatus: (state, action) => {
            state.newNotificationAvailable = action.payload
        },
    }
})

export const { setCredentials, signOut, setAuthPageMode, setResetPageMode, setVerificationStatus, setNotificationStatus } = authSlice.actions
export default authSlice.reducer