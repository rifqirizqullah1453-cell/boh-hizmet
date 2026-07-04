const SOUND_URL = "/notification.mp3";

let audioCtx: AudioContext | undefined;
let decodedBuffer: AudioBuffer | null | undefined;
let unlocked = false;
let loadPromise: Promise<AudioBuffer | null> | undefined;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function synthesizeBeep(ctx: AudioContext): void {
  // Two-tone chime: high then mid, like a doorbell
  const now = ctx.currentTime;
  const tones = [880, 660];
  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.18);
    gain.gain.setValueAtTime(0, now + i * 0.18);
    gain.gain.linearRampToValueAtTime(0.45, now + i * 0.18 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.25);
    osc.start(now + i * 0.18);
    osc.stop(now + i * 0.18 + 0.28);
  });
}

async function loadBuffer(): Promise<AudioBuffer | null> {
  if (decodedBuffer !== undefined) return decodedBuffer;
  if (!loadPromise) {
    loadPromise = fetch(SOUND_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((bytes) => getAudioContext().decodeAudioData(bytes))
      .then((buffer) => {
        decodedBuffer = buffer;
        return buffer;
      })
      .catch(() => {
        // MP3 missing or undecodable — fall back to synthesized beep
        decodedBuffer = null;
        return null;
      });
  }
  return loadPromise;
}

/**
 * Must be called synchronously from inside a real user gesture handler
 * (click/touchstart/keydown). Browsers only allow `AudioContext.resume()`
 * (or anything that produces sound) to succeed when called this way — once
 * resumed, the SAME context can be used to play sounds later from
 * `onSnapshot` callbacks, which are NOT user gestures, without being blocked.
 *
 * This is the one unavoidable manual step: there is no way to play audio
 * before the user has interacted with the page at all, by design of every
 * major browser. The practical fix is making sure that interaction already
 * happened before the first order can arrive — see useAudioUnlock.ts for
 * how WorkerDashboard wires this into the existing "Go Online" toggle
 * instead of asking for a separate, extra tap.
 */
export async function unlockAudio(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  // Prime the buffer now too, so the first real notification doesn't pay
  // the network+decode latency on top of the alert delay.
  void loadBuffer();
  unlocked = true;
}

export function isAudioUnlocked(): boolean {
  return unlocked;
}

export async function playNewOrderAlert(): Promise<void> {
  if (!unlocked) {
    console.warn("[audioPlayer] Skipped playback: audio not yet unlocked by a user gesture.");
    return;
  }
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();
    const buffer = await loadBuffer();
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } else {
      synthesizeBeep(ctx);
    }
  } catch (err) {
    console.warn("[audioPlayer] Playback failed", err);
  }
}
