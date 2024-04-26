import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    
};


const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
export const storage = getStorage(app);




