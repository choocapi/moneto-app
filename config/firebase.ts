// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgQpgtRmm0GLguhzAvw-0Slt8QkxrlZVk",
  authDomain: "moneto-5ac67.firebaseapp.com",
  projectId: "moneto-5ac67",
  storageBucket: "moneto-5ac67.firebasestorage.app",
  messagingSenderId: "906828090995",
  appId: "1:906828090995:web:df0121919dd1d410616406",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// DB
export const firestore = getFirestore(app);

// Storage
export const storage = getStorage(app);
