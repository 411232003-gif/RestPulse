export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  targetMuscles: string[];
  equipment: string;
  icon: string;
  /** joint-angle cues rendered on the form-guide mannequin */
  formCues: { joint: string; angle: string; note: string }[];
  dos: string[];
  donts: string[];
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  setIndex: number;
  restSeconds: number;
  restCompleted: boolean;
  photoUrl?: string;
  timestamp: number;
}

export interface RestSession {
  id: string;
  exerciseName: string;
  plannedSeconds: number;
  actualSeconds: number;
  skipped: boolean;
  timestamp: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  sets: WorkoutSet[];
  restSessions: RestSession[];
  startedAt: number;
  endedAt?: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  defaultRestSeconds: number;
  autoRest: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  createdAt: number;
}
