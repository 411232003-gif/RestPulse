import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

/**
 * Firestore powers: user profiles, workout session logs, rest-timer
 * session tracking, and photo-attachment metadata.
 *
 * If env vars are absent the app degrades gracefully to the offline
 * localStorage layer in lib/storage.ts — callers should go through
 * lib/data.ts which picks the backend automatically.
 */

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(cfg.apiKey && cfg.projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getDb(): Firestore | null {
  if (!firebaseEnabled) return null;
  if (!app) app = getApps().length ? getApps()[0] : initializeApp(cfg);
  if (!db) db = getFirestore(app);
  return db;
}

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
};
