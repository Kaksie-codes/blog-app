import { createSlice } from "@reduxjs/toolkit";

export interface CurrentUser{
    accessToken: string;
    profile_img: string;
    username: string;
    fullname: string;
}
interface UserState {
    currentUser: CurrentUser | null; 
    isLoading: boolean;
    error: null | string; 
}

const initialState: UserState = {
    currentUser:null,
    isLoading: false,
    error: null
}

const userSlice = createSlice({ 
    name: 'user',
    initialState,
    reducers:{ 
        signInStart: (state) => {
            state.isLoading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {            
            state.isLoading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        },
    }
})


export const { signInStart, signInSuccess, signInFailure, signoutSuccess } = userSlice.actions;
export default userSlice.reducer;