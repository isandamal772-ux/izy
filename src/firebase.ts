import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

let firebaseApp;
let firestoreDb: any = null;
let firebaseAuth: any = null;
let googleProvider: any = null;
let isFirebaseAvailable = false;

if (config && config.apiKey) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
    firestoreDb = getFirestore(firebaseApp, config.firestoreDatabaseId || "(default)");
    firebaseAuth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
    isFirebaseAvailable = true;
    console.log("Firebase initialized successfully with cloud configuration.", config.projectId);

    // Validate the connection as instructed in the guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or internet connection.");
        }
      }
    };
    testConnection();
  } catch (e) {
    console.warn("Firebase failed to initialize with provided config:", e);
  }
} else {
  console.warn("Firebase configuration apiKey is empty. Operating in local fallback mode.");
}

export const db = firestoreDb;
export const auth = firebaseAuth;
export const provider = googleProvider;
export const isReady = isFirebaseAvailable;

// Firestore customized dynamic error wrapper
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
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = firebaseAuth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Comprehensive Error LOG: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Global Auth sign-in triggers wrapper
export async function loginWithGoogle() {
  if (!isFirebaseAvailable || !firebaseAuth || !googleProvider) {
    // Return a mock user for instant premium local testing
    const mockUser = {
      uid: "mock-user-123",
      email: "travellover@example.com",
      displayName: "International Explorer",
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      favorites: [],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("izysl_user", JSON.stringify(mockUser));
    return mockUser;
  }
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    // Persist real user too
    const userObj = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
    localStorage.setItem("izysl_user", JSON.stringify(userObj));
    return result.user;
  } catch (error) {
    console.error("Authentication popup failed: ", error);
    throw error;
  }
}

export async function logoutUser() {
  localStorage.removeItem("izysl_user");
  localStorage.removeItem("visit_srilanka_user");
  if (!isFirebaseAvailable || !firebaseAuth) {
    return;
  }
  await signOut(firebaseAuth);
}
