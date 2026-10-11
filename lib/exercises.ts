import type { Exercise } from "./types";

export const EXERCISES: Exercise[] = [
  {
    id: "bench-press",
    name: "Bench Press",
    muscleGroup: "Chest",
    targetMuscles: ["Pectoralis major", "Anterior deltoid", "Triceps"],
    equipment: "Barbell + Bench",
    icon: "bench",
    formCues: [
      { joint: "Elbow", angle: "~75°", note: "Tuck elbows, don't flare to 90°" },
      { joint: "Wrist", angle: "0°", note: "Stacked over elbow, bar in palm heel" },
      { joint: "Shoulder", angle: "Pinned", note: "Scapula retracted & depressed" },
      { joint: "Hip", angle: "Arch", note: "Feet planted, slight thoracic arch" },
    ],
    dos: [
      "Retract shoulder blades before unracking",
      "Touch the bar to mid-chest with control",
      "Drive feet into the floor on every rep",
    ],
    donts: [
      "Bounce the bar off your chest",
      "Lift hips off the bench",
      "Let wrists bend backward under load",
    ],
  },
  {
    id: "squat",
    name: "Back Squat",
    muscleGroup: "Legs",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    equipment: "Barbell + Rack",
    icon: "squat",
    formCues: [
      { joint: "Knee", angle: "~90°+", note: "Track over toes, break parallel" },
      { joint: "Hip", angle: "Hinge", note: "Sit back AND down together" },
      { joint: "Spine", angle: "Neutral", note: "Brace core, chest proud" },
      { joint: "Ankle", angle: "Flexed", note: "Weight through mid-foot" },
    ],
    dos: [
      "Brace your core before unracking",
      "Break parallel — hip crease below knee",
      "Keep knees tracking over your toes",
    ],
    donts: [
      "Let knees cave inward (valgus)",
      "Round the lower back at the bottom",
      "Lift heels off the floor",
    ],
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: "Posterior Chain",
    targetMuscles: ["Glutes", "Hamstrings", "Erectors", "Lats", "Traps"],
    equipment: "Barbell",
    icon: "deadlift",
    formCues: [
      { joint: "Hip", angle: "Hinge", note: "Push hips back, bar over mid-foot" },
      { joint: "Spine", angle: "Neutral", note: "Lats engaged — 'bend the bar'" },
      { joint: "Shoulder", angle: "Packed", note: "Arms hang as hooks" },
      { joint: "Knee", angle: "Soft", note: "Shins touch the bar at setup" },
    ],
    dos: [
      "Keep the bar scraping your shins/thighs",
      "Push the floor away — don't pull with the back",
      "Lock out by squeezing glutes, not leaning back",
    ],
    donts: [
      "Round the lumbar spine under load",
      "Jerk the bar off the floor",
      "Hyperextend at the top",
    ],
  },
  {
    id: "db-row",
    name: "Dumbbell Row",
    muscleGroup: "Back",
    targetMuscles: ["Lats", "Rhomboids", "Rear deltoid", "Biceps"],
    equipment: "Dumbbell + Bench",
    icon: "row",
    formCues: [
      { joint: "Elbow", angle: "Pull", note: "Drive elbow to the hip, not the sky" },
      { joint: "Spine", angle: "Neutral", note: "Torso near parallel to floor" },
      { joint: "Shoulder", angle: "Packed", note: "No shrugging to the ear" },
    ],
    dos: [
      "Brace the non-working arm on the bench",
      "Squeeze the lat for a full second at the top",
      "Lower the dumbbell under control",
    ],
    donts: [
      "Twist the torso to swing the weight",
      "Use momentum from the hips",
      "Let the shoulder dump forward at the bottom",
    ],
  },
  {
    id: "ohp",
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    targetMuscles: ["Deltoids", "Triceps", "Upper chest", "Core"],
    equipment: "Barbell",
    icon: "press",
    formCues: [
      { joint: "Wrist", angle: "Stacked", note: "Bar over forearms at lockout" },
      { joint: "Hip", angle: "Glutes ON", note: "Squeeze glutes, ribs down" },
      { joint: "Elbow", angle: "Slight fwd", note: "Slightly in front of the bar" },
    ],
    dos: [
      "Move your head back, then through at lockout",
      "Squeeze glutes and brace abs hard",
      "Start the bar at collarbone height",
    ],
    donts: [
      "Lean back and turn it into a push press",
      "Flare elbows wide to the sides",
      "Press in a curve around your face",
    ],
  },
  {
    id: "curl",
    name: "Bicep Curl",
    muscleGroup: "Arms",
    targetMuscles: ["Biceps", "Brachialis", "Forearms"],
    equipment: "Dumbbells / EZ Bar",
    icon: "curl",
    formCues: [
      { joint: "Elbow", angle: "Pinned", note: "Fixed at your side, no drift" },
      { joint: "Wrist", angle: "Neutral", note: "Supinate through the lift" },
    ],
    dos: [
      "Keep elbows pinned to your torso",
      "Control the negative for 2–3 seconds",
      "Fully extend at the bottom",
    ],
    donts: [
      "Swing your torso to cheat the weight",
      "Half-rep at the bottom",
      "Let elbows flare forward at the top",
    ],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
