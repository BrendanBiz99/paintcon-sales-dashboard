import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured, getUserRole, repEmailToId } from '../firebase';

const AuthContext = createContext(null);

const DEMO_STORAGE_KEY = 'paintcon_demo_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [repId, setRepId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  function applyUser(email) {
    const role = getUserRole(email);
    const rid = repEmailToId[email] || null;
    setUser({ email });
    setUserRole(role);
    setRepId(rid);
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Demo mode: check localStorage
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          applyUser(parsed.email);
        } catch {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }
      setLoading(false);
      return;
    }

    // Real Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        const role = getUserRole(email);
        const rid = repEmailToId[email] || null;
        setUser(firebaseUser);
        setUserRole(role);
        setRepId(rid);
      } else {
        setUser(null);
        setUserRole(null);
        setRepId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function logout() {
    if (!isFirebaseConfigured) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setUser(null);
      setUserRole(null);
      setRepId(null);
      return;
    }
    await signOut(auth);
  }

  // Demo sign-in helper (called from LoginPage)
  function demoSignIn(email) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ email }));
    applyUser(email);
  }

  return (
    <AuthContext.Provider value={{ user, userRole, repId, loading, logout, isDemoMode, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
