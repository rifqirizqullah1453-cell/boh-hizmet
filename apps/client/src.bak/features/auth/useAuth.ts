import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
// Side-effect import: ensures Firebase app + Auth emulator are initialized
// before any auth operation is attempted.
import "../../lib/firestoreClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
