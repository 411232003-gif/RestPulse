"use client";

import {
  getDb,
  firebaseEnabled,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "./firebase";
import type { UserProfile, WorkoutLog, WorkoutSet, RestSession } from "./types";

/**
 * Unified persistence layer.
 * - Firestore when configured (collection `restpulse/<userId>/…`).
 * - localStorage fallback so the app is fully functional offline/demo.
 */

const LS_KEYS = {
  profile: "restpulse.profile",
  sets: "restpulse.sets",
  rests: "restpulse.rests",
};

export const DEFAULT_USER_ID = "local-athlete";

export const DEFAULT_PROFILE: UserProfile = {
  id: DEFAULT_USER_ID,
  displayName: "Athlete",
  defaultRestSeconds: 60,
  autoRest: true,
  soundEnabled: true,
  hapticsEnabled: true,
  createdAt: Date.now(),
};

/* ── localStorage helpers ─────────────────────────────────────── */

function lsRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota/private mode */
  }
}

/* ── Profile ──────────────────────────────────────────────────── */

export async function loadProfile(): Promise<UserProfile> {
  const db = getDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, "restpulse_profiles", DEFAULT_USER_ID));
      if (snap.exists()) return { ...DEFAULT_PROFILE, ...(snap.data() as UserProfile) };
    } catch {
      /* fall through to local */
    }
  }
  return lsRead<UserProfile>(LS_KEYS.profile, DEFAULT_PROFILE);
}

export async function saveProfile(p: UserProfile) {
  lsWrite(LS_KEYS.profile, p);
  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, "restpulse_profiles", p.id), p, { merge: true });
    } catch {
      /* offline — local copy already saved */
    }
  }
}

/* ── Workout sets ─────────────────────────────────────────────── */

export async function loadSets(): Promise<WorkoutSet[]> {
  const db = getDb();
  if (db) {
    try {
      const q = query(
        collection(db, "restpulse_profiles", DEFAULT_USER_ID, "sets"),
        orderBy("timestamp", "desc"),
        limit(500)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as WorkoutSet);
    } catch {
      /* fall through */
    }
  }
  return lsRead<WorkoutSet[]>(LS_KEYS.sets, []);
}

export async function saveSet(set: WorkoutSet) {
  const sets = lsRead<WorkoutSet[]>(LS_KEYS.sets, []);
  const idx = sets.findIndex((s) => s.id === set.id);
  if (idx >= 0) sets[idx] = set;
  else sets.push(set);
  lsWrite(LS_KEYS.sets, sets);

  const db = getDb();
  if (db) {
    try {
      await setDoc(
        doc(db, "restpulse_profiles", DEFAULT_USER_ID, "sets", set.id),
        set
      );
    } catch {
      /* local copy saved */
    }
  }
}

/* ── Rest sessions (compliance tracking) ──────────────────────── */

export async function loadRestSessions(): Promise<RestSession[]> {
  const db = getDb();
  if (db) {
    try {
      const q = query(
        collection(db, "restpulse_profiles", DEFAULT_USER_ID, "restSessions"),
        orderBy("timestamp", "desc"),
        limit(500)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as RestSession);
    } catch {
      /* fall through */
    }
  }
  return lsRead<RestSession[]>(LS_KEYS.rests, []);
}

export async function saveRestSession(s: RestSession) {
  const rests = lsRead<RestSession[]>(LS_KEYS.rests, []);
  rests.push(s);
  lsWrite(LS_KEYS.rests, rests);

  const db = getDb();
  if (db) {
    try {
      await setDoc(
        doc(db, "restpulse_profiles", DEFAULT_USER_ID, "restSessions", s.id),
        s
      );
    } catch {
      /* local copy saved */
    }
  }
}

export function backendLabel() {
  return firebaseEnabled ? "Firestore" : "Local";
}
