import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
export const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(user.emailVerified);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser({ ...user, ...data });
    }
  };

  const updateUsername = async (userId, newUsername) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { username: newUsername });
      setUser({ ...user, username: newUsername });
      return { success: true };
    } catch (error) {
      console.error("Error updating username: ", error);
      return { success: false, error };
    }
  };

  const updateProfileUrl = async (userId, downloadURL) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { profileUrl: downloadURL });
      setUser({ ...user, profileUrl: downloadURL });
      return { success: true };
    } catch (error) {
      console.error("Error updating Profile Photo: ", error);
      return { success: false, error };
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        password: password,
        username: username,
        userId: user.uid
      });
      await sendEmailVerification(user);
      router.back();
     
      Toast.show({
        type: 'error',
        text1: 'Sign Up',
        text2: "Please verify your email to login. 😊",
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
      return { success: true, data: user.uid };
    } catch (error) {
      let msg = error.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid E-Mail';
      if (msg.includes('(auth/email-already-in-use)')) msg = 'E-Mail Already In Use';
      return { success: false, msg };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      setIsAuthenticated(user.emailVerified);
      if (!user.emailVerified) {
    
        Toast.show({
          type: 'error',
          text1: 'error',
          text2: 'Please verify your email to login.',
          visibilityTime: 5000,
          text1Style: { fontSize: 22 },
          text2Style: { fontSize: 18 },
        });
        await signOut(auth);
      }
      return { success: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid E-Mail 😢';
      if (msg.includes('(auth/wrong-password)')) msg = 'Invalid Password 😢';
      if (msg.includes('(auth/user-not-found)')) msg = 'User Not Found 😢';
      if (msg.includes('(auth/invalid-credential)')) msg = 'Invalid Credential 😢';
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.message, error };
    }
  };


  const updateEmailAndVerify = async (newEmail, password) => {
    try {
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not found");
      }

      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      
      await updateEmail(currentUser, newEmail);

      
      await sendEmailVerification(currentUser);

      return { success: true };
    } catch (error) {
      console.error("Error updating email:", error);
      return { success: false, error };
    }
  };




  return (
    <authContext.Provider
      value={{ user, isAuthenticated, login, logout, register, updateUsername, sendPasswordResetEmail, updateProfileUrl, updateEmailAndVerify }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(authContext);

  if (!value) {
    throw new Error("useAuth must be wrapped");
  }

  return value;
};
