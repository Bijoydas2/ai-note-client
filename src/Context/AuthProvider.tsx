import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import app from "../firebase/firebase.config";

// Type definition for the context
interface AuthContextType {
  signup: (email: string, password: string) => Promise<User | null>;
  loginUser: (email: string, password: string) => Promise<User | null>;
  googleLogin: () => Promise<User | null>;
  logOut: () => Promise<void>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const auth = getAuth(app);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Email/Password Signup
  const signup = async (email: string, password: string): Promise<User | null> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // 🔹 Email/Password Login
  const loginUser = async (email: string, password: string): Promise<User | null> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // 🔹 Google Login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async (): Promise<User | null> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // 🔹 Logout
  const logOut = async (): Promise<void> => {
    await signOut(auth);
  };

  // 🔹 Auth State Change Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo: AuthContextType = {
    signup,
    loginUser,
    googleLogin,
    logOut,
    user,
    setUser,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
