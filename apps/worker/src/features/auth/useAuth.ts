import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
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
