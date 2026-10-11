"use client";

import { create } from "zustand";
import type { UserProfile, WorkoutSet, RestSession } from "@/lib/types";
import { DEFAULT_PROFILE, loadProfile, saveProfile, loadSets, saveSet, loadRestSessions, saveRestSession } from "@/lib/data";

interface WorkoutState {
  profile: UserProfile;
  sets: WorkoutSet[];
  restSessions: RestSession[];
  activeExerciseId: string | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => void;
  addSet: (set: WorkoutSet) => void;
  updateSet: (set: WorkoutSet) => void;
  addRestSession: (s: RestSession) => void;
  setActiveExercise: (id: string | null) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  sets: [],
  restSessions: [],
  activeExerciseId: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const [profile, sets, restSessions] = await Promise.all([
      loadProfile(),
      loadSets(),
      loadRestSessions(),
    ]);
    set({ profile, sets, restSessions, hydrated: true });
  },

  updateProfile: (patch) => {
    const profile = { ...get().profile, ...patch };
    set({ profile });
    void saveProfile(profile);
  },

  addSet: (s) => {
    set({ sets: [...get().sets, s] });
    void saveSet(s);
  },

  updateSet: (s) => {
    set({ sets: get().sets.map((x) => (x.id === s.id ? s : x)) });
    void saveSet(s);
  },

  addRestSession: (s) => {
    set({ restSessions: [...get().restSessions, s] });
    void saveRestSession(s);
  },

  setActiveExercise: (id) => set({ activeExerciseId: id }),
}));
