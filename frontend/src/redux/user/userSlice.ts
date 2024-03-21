import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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