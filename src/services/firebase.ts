import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connection on boot as mandated by skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline check:', error.message);
    }
  }
}
testFirestoreConnection();

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  jobRole?: string;
  companyName?: string;
  cloudRegion?: string;
  createdAt?: any;
}

// User Profile management in Firestore
export async function syncUserProfile(
  user: FirebaseUser,
  extra?: { jobRole?: string; companyName?: string; cloudRegion?: string }
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || extra?.jobRole ? `${user.displayName || 'Alex Chen'}` : 'Enterprise Analyst',
      photoURL: user.photoURL,
      jobRole: extra?.jobRole || 'VP of Analytics / Business Lead',
      companyName: extra?.companyName || 'Global Retail Corp',
      cloudRegion: extra?.cloudRegion || 'US East (N. Virginia)',
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const existing = snap.data() as UserProfile;
    if (extra && (extra.jobRole || extra.companyName || extra.cloudRegion)) {
      const updated = {
        ...existing,
        ...extra,
      };
      await setDoc(userRef, updated, { merge: true });
      return updated;
    }
    return existing;
  }
}

// Sign In with Google popup
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-In error:', err);
    throw err;
  }
}

// Sign In with Email & Password
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(result.user);
  return result.user;
}

// Register with Email & Password
export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string,
  extra: { jobRole: string; companyName: string; cloudRegion: string }
): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  await syncUserProfile(result.user, { ...extra });
  return result.user;
}

// Sign Out
export async function logOut(): Promise<void> {
  await fbSignOut(auth);
}

// Save message to user's Firestore Copilot history
export async function saveUserChatMessage(
  userId: string,
  sessionId: string,
  message: { sender: 'user' | 'assistant'; text: string; timestamp: string }
) {
  try {
    const messagesCol = collection(db, 'users', userId, 'chatSessions', sessionId, 'messages');
    await addDoc(messagesCol, {
      ...message,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not persist chat message to Firestore:', err);
  }
}

// Save connected data source to Firestore
export async function saveUserDataSource(
  userId: string,
  source: { name: string; category: string; host?: string; status: string }
) {
  try {
    const sourcesCol = collection(db, 'users', userId, 'customDataSources');
    await addDoc(sourcesCol, {
      ...source,
      userId,
      connectedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not persist data source to Firestore:', err);
  }
}
