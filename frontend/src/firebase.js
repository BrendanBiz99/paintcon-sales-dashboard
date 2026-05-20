import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is actually configured (not placeholder values)
export const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('your-');

let app = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };

// Email → role mapping
export const repEmailToId = {
  'sarah.chen@paintcon.com': 'rep1',
  'marcus.johnson@paintcon.com': 'rep2',
  'emily.rodriguez@paintcon.com': 'rep3',
  'david.kim@paintcon.com': 'rep4',
  'jessica.taylor@paintcon.com': 'rep5',
};

const OWNER_EMAILS = new Set(['owner@paintcon.com']);

export function getUserRole(email) {
  if (!email) return null;
  if (OWNER_EMAILS.has(email) || email.includes('owner')) return 'owner';
  if (repEmailToId[email]) return 'rep';
  return null;
}
