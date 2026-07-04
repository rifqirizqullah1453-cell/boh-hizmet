import { useCallback, useEffect, useState } from "react";
import { unlockAudio, isAudioUnlocked } from "./audioPlayer";

/**
 * Two unlock paths, both ending at the same `unlockAudio()`:
 *
 * 1. Explicit: call the returned `unlock` from a real action the worker
 *    already takes for another reason — e.g. the "Go Online" toggle in
 *    WorkerDashboard. This guarantees audio is armed before the first
 *    order can possibly arrive, with zero extra taps asked of the worker.
 * 2. Passive fallback: a one-time, capture-phase listener on the window
 *    for the first click/touch/key of the session, in case the worker
 *    interacts with something else first. Removes itself after firing once.
 */
export function useAudioUnlock() {
  const [unlocked, setUnlocked] = useState(isAudioUnlocked);

  useEffect(() => {
    if (unlocked) return;

    const handleFirstGesture = () => {
      unlockAudio().then(() => setUnlocked(true));
    };

    const opts: AddEventListenerOptions = { once: true, capture: true };
    window.addEventListener("pointerdown", handleFirstGesture, opts);
    window.addEventListener("keydown", handleFirstGesture, opts);

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture, opts);
      window.removeEventListener("keydown", handleFirstGesture, opts);
    };
  }, [unlocked]);

  const unlock = useCallback(() => {
    unlockAudio().then(() => setUnlocked(true));
  }, []);

  return { unlocked, unlock };
}
