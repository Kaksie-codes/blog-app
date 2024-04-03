// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "enblogg--auth.firebaseapp.com",
  projectId: "enblogg--auth",
  storageBucket: "enblogg--auth.appspot.com",
  messagingSenderId: "92824185304",
  appId: "1:92824185304:web:3f5b26a13d670b14e12aad"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// apiKey: import.meta.env.VITE_FIREBASE_API_KEY,