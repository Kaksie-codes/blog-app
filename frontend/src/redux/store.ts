import { combineReducers, configureStore } from '@reduxjs/toolkit'
import blogPostReducer from './blogpost/blogPostSlice'
import authReducer from './auth/authSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Define root state type
export type RootState = ReturnType<typeof rootReducer>;

// Define dispatch function type
export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({ 
    auth: authReducer,
    blogPost: blogPostReducer,
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })   
})


export const persistor = persistStore(store);