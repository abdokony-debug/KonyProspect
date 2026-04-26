import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc,
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export const signIn = () => signInWithPopup(auth, googleProvider);
export const signOut = () => auth.signOut();
export const updateUserProfile = (displayName: string) => {
  if (!auth.currentUser) return Promise.reject('No user logged in');
  return updateProfile(auth.currentUser, { displayName });
};

// Lead Operations
export const saveLeadToDb = async (lead: any) => {
  const path = 'leads';
  const leadId = lead.id || `L-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  try {
    await setDoc(doc(db, path, leadId), {
      ...lead,
      id: leadId,
      userId: auth.currentUser?.uid,
      savedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteLeadFromDb = async (id: string) => {
  const path = `leads/${id}`;
  try {
    await deleteDoc(doc(db, 'leads', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const updateLeadInDb = async (id: string, updates: any) => {
  const path = `leads/${id}`;
  try {
    await updateDoc(doc(db, 'leads', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Search History Operations
export const saveSearchHistory = async (searchData: any) => {
  const path = 'search_history';
  try {
    await addDoc(collection(db, path), {
      ...searchData,
      userId: auth.currentUser?.uid,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteSearchHistoryItem = async (id: string) => {
  const path = `search_history/${id}`;
  try {
    await deleteDoc(doc(db, 'search_history', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const clearAllSearchHistory = async (userId: string) => {
  // We'll implement this manually using batch or just inform the user we'll use a loop for now
};

// Search Preset Operations
export const saveSearchPreset = async (presetData: any) => {
  const path = 'search_presets';
  try {
    await addDoc(collection(db, path), {
      ...presetData,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteSearchPreset = async (id: string) => {
  const path = `search_presets/${id}`;
  try {
    await deleteDoc(doc(db, 'search_presets', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Product Intelligence Operations
export const saveProductToDb = async (productData: any) => {
  const path = 'products';
  try {
    await addDoc(collection(db, path), {
      ...productData,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// Storage Operations (Giant Cloud Storage)
export const uploadEvidence = async (path: string, blob: Blob) => {
  try {
    const storageRef = ref(storage, `evidence/${auth.currentUser?.uid}/${path}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('[STORAGE-FAULT] Evidence upload failed:', error);
    return null;
  }
};
