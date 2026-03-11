import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (firebaseUser: FirebaseUser, name?: string) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const now = new Date();
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      const userData: Omit<User, 'uid'> = {
        name: name || firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        plan: 'free',
        monthlyExports: 25,
        exportsUsed: 0,
        topupExports: 0,
        planStartDate: now,
        nextReset: nextReset,
        createdAt: now,
      };

      await setDoc(userRef, {
        ...userData,
        planStartDate: serverTimestamp(),
        nextReset: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      return { uid: firebaseUser.uid, ...userData } as User;
    }

    const data = userSnap.data();
    return {
      uid: firebaseUser.uid,
      ...data,
      planStartDate: data.planStartDate?.toDate() || new Date(),
      nextReset: data.nextReset?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await createUserDocument(firebaseUser);
      setUser(userData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const userData = await createUserDocument(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await createUserDocument(result.user);
    setUser(userData);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const userData = await createUserDocument(result.user, name);
    setUser(userData);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userData = await createUserDocument(result.user);
    setUser(userData);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
