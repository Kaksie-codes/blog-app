import { createSlice } from "@reduxjs/toolkit";

export interface CurrentUser{    
    profile_img: string;
    username: string;
    fullname: string;
}

interface UserState {
    userInfo: CurrentUser | null; 
    authPageMode: string 
}

const initialState: UserState = {
    userInfo:null,
    authPageMode: 'sign-in'
    
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
        }
    }
})

export const { setCredentials, signOut, setAuthPageMode } = authSlice.actions
export default authSlice.reducer