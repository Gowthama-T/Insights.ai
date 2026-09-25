import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  UserProfile,
  syncUserProfile,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  logOut,
} from '../services/firebase';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  register: (
    email: string,
    pass: string,
    displayName: string,
    extra: { jobRole: string; companyName: string; cloudRegion: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);
        } catch (err) {
          console.warn('Could not sync user profile:', err);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Alex Chen',
            photoURL: user.photoURL,
            jobRole: 'VP of Analytics / Business Lead',
            companyName: 'Global Retail Corp',
            cloudRegion: 'US East (N. Virginia)',
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const profile = await syncUserProfile(user);
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await signInWithEmail(email, pass);
      const profile = await syncUserProfile(user);
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    pass: string,
    displayName: string,
    extra: { jobRole: string; companyName: string; cloudRegion: string }
  ) => {
    setLoading(true);
    try {
      const user = await registerWithEmail(email, pass, displayName, extra);
      const profile = await syncUserProfile(user, extra);
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logOut();
    setUserProfile(null);
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const profile = await syncUserProfile(currentUser);
      setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
