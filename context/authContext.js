import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
export const authContext = createContext();
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setisAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setisAuthenticated(false);
        setUser(null);
      }
    })
    return unsub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({ ...user, username: data.username, userId: data.userId });
    }
  }



  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid Email'
      if (msg.includes('(auth/invalid-credential)')) msg = 'Wrong Credentials'
      return { success: false, msg };
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true }
    } catch (error) {
      return { success: false, msg: error.message, error: error }
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        userId: user.uid
      });
      return { success: true, data: user.uid };
    } catch (error) {
      let msg = error.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid Email'
      if (msg.includes('(auth/email-already-in-use)')) msg = 'Invalid Email'
      return { success: false, msg };
    }
  };

  return (
    <authContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
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
