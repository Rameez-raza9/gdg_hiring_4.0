import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyC7oulA2ScwLGWOA13z1oqFNJEzINZV1gk",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "gdgsvec40.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gdgsvec40",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "gdgsvec40.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "202883905077",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:202883905077:web:bc206ecca3455f8f45237c",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S1H8DGC1ZE",
};

// Initialize Firebase singleton
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Analytics (Client-side only)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export async function signInWithGoogle(): Promise<{
  user: User | null;
  error: string | null;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Google sign in error:", error);
    return { user: null, error: error?.message || "Google sign-in failed" };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { ok: true, error: null };
  } catch (error: any) {
    return { ok: false, error: error?.message };
  }
}
