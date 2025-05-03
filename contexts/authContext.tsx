import { auth, firestore } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { UserType } from "@/types";

type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (firebaseUser) => {
      // console.log('firebaseUser: ', firebaseUser);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser?.uid); // Why do we need to update user data here?
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });
    return () => unsubcribe(); // Why do we need to return function?
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      // console.log('login msg: ', msg);
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Email hoặc mật khẩu không chính xác";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      // console.log('register msg: ', msg);
      if (msg.includes("(auth/email-already-in-use)")) msg = "Email đã tồn tại";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  // It get or set user data from firestore?
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      let msg = error.message;
      // return {success: false, msg};
      console.log("updateUserData error: ", error);
    }
  };

  // What is contextValue?
  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    // React native call function as component?
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  // Why AuthContext not defined with provider but we can use it here?
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
