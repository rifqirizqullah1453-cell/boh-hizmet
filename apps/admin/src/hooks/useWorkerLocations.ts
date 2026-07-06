import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../lib/firebaseClient";

export interface WorkerLocation {
  uid: string;   // firebaseUid
  lat: number;
  lng: number;
  accuracy: number | null;
}

export function useWorkerLocations() {
  const [locations, setLocations] = useState<Map<string, WorkerLocation>>(new Map());

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "worker_locations"), (snap) => {
      setLocations((prev) => {
        const next = new Map(prev);
        snap.docChanges().forEach((change) => {
          if (change.type === "removed") {
            next.delete(change.doc.id);
          } else {
            const d = change.doc.data();
            next.set(change.doc.id, {
              uid: change.doc.id,
              lat: d.lat,
              lng: d.lng,
              accuracy: d.accuracy ?? null,
            });
          }
        });
        return next;
      });
    });
    return unsub;
  }, []);

  return locations;
}
