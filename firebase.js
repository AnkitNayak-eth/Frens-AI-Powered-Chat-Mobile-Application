import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDlG3qSBoqoue0di95VIM-kcebuW1bDk5Y",
    authDomain: "chat-app-d8233.firebaseapp.com",
    projectId: "chat-app-d8233",
    storageBucket: "chat-app-d8233.appspot.com",
    messagingSenderId: "455229269274",
    appId: "1:455229269274:web:9d643d7968235a7076f8a3",
    measurementId: "G-10ESF68TV8"
};


const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
export const storage = getStorage(app);




