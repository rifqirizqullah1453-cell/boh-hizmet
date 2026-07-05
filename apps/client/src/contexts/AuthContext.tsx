import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile as fbUpdateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { trpc } from '@/providers/trpc';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  userProfile: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  isAdmin: boolean;
  isWorker: boolean;
  isCustomer: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string, role: UserRole, extra?: Partial<UserProfile>) => Promise<void>;
  signOut: () => void;
  loginAsGuest: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const SESSION_KEY = 'boh_session';
function saveSession(p: UserProfile | null) {
  try {
    if (p) localStorage.setItem(SESSION_KEY, JSON.stringify(p));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [fbReady, setFbReady] = useState(false);

  const isAdmin = userProfile?.role === 'admin';
  const isWorker = userProfile?.role === 'worker';
  const isCustomer = userProfile?.role === 'customer';

  // Server profile (for role + DB fields)
  const { data: serverUser } = trpc.auth.me.useQuery(undefined, {
    enabled: !!userProfile && fbReady,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Admin: list all users
  const { data: adminUsers } = trpc.admin.listUsers.useQuery(
    { limit: 100 },
    { enabled: isAdmin && fbReady }
  );

  const registerMut = trpc.auth.register.useMutation();
  const updateProfileMut = trpc.auth.updateProfile.useMutation();

  // Sync Firebase auth → local profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const base: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || 'User',
          email: fbUser.email || '',
          role: 'customer',
          phone: '',
          rating: 5.0,
          totalRatings: 0,
          isOnline: true,
          createdAt: fbUser.metadata.creationTime ? new Date(fbUser.metadata.creationTime).getTime() : Date.now(),
          photoURL: fbUser.photoURL || undefined,
        };
        setUserProfile(prev => {
          const merged = { ...base, ...(prev?.uid === fbUser.uid ? prev : {}) };
          saveSession(merged);
          return merged;
        });
      } else {
        // Preserve guest sessions — they have no Firebase user but are still valid.
        try {
          const raw = localStorage.getItem(SESSION_KEY);
          const existing = raw ? JSON.parse(raw) : null;
          if (!existing?.uid?.startsWith('guest-')) {
            setUserProfile(null);
            saveSession(null);
          }
        } catch {
          setUserProfile(null);
          saveSession(null);
        }
      }
      setFbReady(true);
    });
    return unsub;
  }, []);

  // Sync server user (role, name) → local profile
  useEffect(() => {
    if (!serverUser) return;
    setUserProfile(prev => {
      if (!prev) return prev;
      const sv = serverUser as any;
      const updated: UserProfile = {
        ...prev,
        name: sv.name || prev.name,
        role: (sv.role as UserRole) || prev.role,
        rating: parseFloat(String(sv.rating ?? '5.0')),
        totalRatings: sv.totalRatings || 0,
        isOnline: sv.isOnline || false,
      };
      saveSession(updated);
      return updated;
    });
  }, [serverUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signInWithFacebook = useCallback(async () => {
    await signInWithPopup(auth, new FacebookAuthProvider());
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string, phone: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name.trim()) await fbUpdateProfile(cred.user, { displayName: name.trim() });
    // authenticateRequest auto-creates a MySQL row on first request, but with
    // role:"customer" by default. Call auth.register to set the real role + name.
    try {
      const safeRole: 'customer' | 'worker' = role === 'worker' ? 'worker' : 'customer';
      await registerMut.mutateAsync({ name: name.trim() || 'User', role: safeRole });
    } catch { /* non-fatal — row already exists with correct defaults for customers */ }
    // Persist phone number if provided
    if (phone) {
      try { await updateProfileMut.mutateAsync({ phone }); } catch { /* non-fatal */ }
    }
  }, [registerMut, updateProfileMut]);

  const signOut = useCallback(() => {
    fbSignOut(auth);
    setUserProfile(null);
    saveSession(null);
  }, []);

  const loginAsGuest = useCallback(() => {
    const guest: UserProfile = {
      uid: 'guest-' + Date.now(),
      name: 'Guest',
      email: '',
      role: 'customer',
      phone: '',
      rating: 5.0,
      totalRatings: 0,
      isOnline: true,
      createdAt: Date.now(),
    };
    setUserProfile(guest);
    saveSession(guest);
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      saveSession(updated);
      return updated;
    });
    // Sync name/phone to backend; sync name/photoURL to Firebase Auth
    const patch: { name?: string; phone?: string } = {};
    if (updates.name) patch.name = updates.name;
    if (updates.phone) patch.phone = updates.phone;
    if (Object.keys(patch).length > 0) {
      updateProfileMut.mutate(patch);
    }
    if ((updates.name || updates.photoURL) && auth.currentUser) {
      const fbPatch: { displayName?: string; photoURL?: string } = {};
      if (updates.name) fbPatch.displayName = updates.name;
      if (updates.photoURL) fbPatch.photoURL = updates.photoURL;
      fbUpdateProfile(auth.currentUser, fbPatch).catch(() => { /* non-fatal */ });
    }
  }, [updateProfileMut]);

  const allUsers: UserProfile[] = (adminUsers?.items || []).map((u: any) => ({
    uid: String(u.id),
    name: u.name || '',
    email: u.email || '',
    role: (u.role as UserRole) || 'customer',
    phone: u.phone || '',
    rating: parseFloat(String(u.rating ?? '5.0')),
    totalRatings: u.totalRatings || 0,
    isOnline: u.isOnline || false,
    createdAt: u.createdAt ? new Date(u.createdAt).getTime() : Date.now(),
  }));

  return (
    <AuthContext.Provider value={{
      userProfile,
      allUsers,
      isLoading: !fbReady,
      isAdmin,
      isWorker,
      isCustomer,
      signIn,
      signInWithGoogle,
      signInWithFacebook,
      signUp,
      signOut,
      loginAsGuest,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
