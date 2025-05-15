import { auth, firestore } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContextType, UserType } from "@/types";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  // Configure Google Sign In
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "906828090995-89e73aerau29ascb11gvpb14lmeshv8r.apps.googleusercontent.com",
      webClientId:
        "906828090995-59u6phvne9n0kunghv5ioqpg6uqgkjvg.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  });

  // Handle navigation based on authentication state
  useEffect(() => {
    if (initializing) return;

    const navigateBasedOnAuth = async () => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/welcome");
      }
    };

    navigateBasedOnAuth();
  }, [initializing, user]);

  // Handle normal sign in status change
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser?.uid);
      } else if (!isGoogleSignIn) {
        setUser(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    });
    return () => unsubcribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
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
      if (msg.includes("(auth/email-already-in-use)")) msg = "Email đã tồn tại";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      return { success: false, msg };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Mạng không ổn định";
      if (msg.includes("(auth/invalid-email)")) msg = "Email không hợp lệ";
      return { success: false, msg };
    }
  };

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
      console.log("updateUserData error: ", error);
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user: googleUser } = response.data;
        setIsGoogleSignIn(true);

        const userDocRef = doc(firestore, "users", googleUser.id);
        const userDoc = await getDoc(userDocRef);

        const userData: UserType = !userDoc.exists()
          ? {
              uid: googleUser.id,
              email: googleUser.email,
              name: googleUser.name,
              image: googleUser.photo,
            }
          : {
              uid: userDoc.data()?.uid,
              email: userDoc.data()?.email,
              name: userDoc.data()?.name,
              image: userDoc.data()?.image,
            };

        if (!userDoc.exists()) {
          await setDoc(userDocRef, userData);
        }

        setUser(userData);

        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            return { success: false, msg: "Đăng nhập bị hủy bỏ" };
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return { success: false, msg: "Play services không khả dụng" };
          case statusCodes.IN_PROGRESS:
            return { success: false, msg: "Đăng nhập đang tiến hành" };
          default:
            return { success: false, msg: error.message + " - " + error.code };
        }
      } else {
        return {
          success: false,
          msg: "Lỗi không xác định (nằm ngoài phạm vi Google Sign In)",
        };
      }
    }
  };

  const logout = async () => {
    try {
      setUser(null);

      if (isGoogleSignIn) {
        try {
          await GoogleSignin.signOut();
        } catch (error) {
          console.error("Error signing out from Google:", error);
        } finally {
          setIsGoogleSignIn(false);
        }
      }

      await auth.signOut();

      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { success: false, msg: error.message };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
    forgotPassword,
    googleSignIn,
    isGoogleSignIn,
    setIsGoogleSignIn,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
