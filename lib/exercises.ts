import type { Exercise } from "./types";

export const EXERCISES: Exercise[] = [
  {
    id: "bench-press",
    name: "Bench Press",
    muscleGroup: "Dada",
    targetMuscles: ["Otot dada", "Bahu depan", "Triceps"],
    equipment: "Barbell + Bangku",
    icon: "bench",
    formCues: [
      { joint: "Siku", angle: "~75°", note: "Siku menekuk, jangan melebar 90°" },
      { joint: "Pergelangan", angle: "0°", note: "Segaris dengan siku, bar di pangkal telapak" },
      { joint: "Bahu", angle: "Terkunci", note: "Tulang belikat ditarik ke belakang & turun" },
      { joint: "Pinggul", angle: "Melengkung", note: "Kaki menapak, punggung atas sedikit naik" },
    ],
    dos: [
      "Tarik tulang belikat ke belakang sebelum mengangkat bar",
      "Turunkan bar ke tengah dada dengan terkendali",
      "Dorong kaki ke lantai di setiap repetisi",
    ],
    donts: [
      "Memantulkan bar ke dada",
      "Mengangkat pinggul dari bangku",
      "Membiarkan pergelangan tertekuk ke belakang",
    ],
  },
  {
    id: "squat",
    name: "Back Squat",
    muscleGroup: "Kaki",
    targetMuscles: ["Paha depan", "Bokong", "Hamstring", "Core"],
    equipment: "Barbell + Rack",
    icon: "squat",
    formCues: [
      { joint: "Lutut", angle: "~90°+", note: "Segaris dengan ujung kaki, turun di bawah paralel" },
      { joint: "Pinggul", angle: "Engsel", note: "Duduk ke belakang DAN ke bawah bersamaan" },
      { joint: "Punggung", angle: "Netral", note: "Core dikunci, dada tegak" },
      { joint: "Mata kaki", angle: "Fleksi", note: "Beban di tengah telapak kaki" },
    ],
    dos: [
      "Kunci perut (brace) sebelum bar keluar rack",
      "Turun sampai lipatan pinggul di bawah lutut",
      "Lutut tetap segaris dengan arah jari kaki",
    ],
    donts: [
      "Lutut masuk ke dalam (valgus)",
      "Punggung bawah membulat di posisi bawah",
      "Tumit terangkat dari lantai",
    ],
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: "Rantai Posterior",
    targetMuscles: ["Bokong", "Hamstring", "Punggung bawah", "Lats", "Traps"],
    equipment: "Barbell",
    icon: "deadlift",
    formCues: [
      { joint: "Pinggul", angle: "Engsel", note: "Pinggul mundur, bar di atas tengah kaki" },
      { joint: "Punggung", angle: "Netral", note: "Lats aktif — 'tekuk' bar-nya" },
      { joint: "Bahu", angle: "Terkunci", note: "Lengan menggantung seperti kait" },
      { joint: "Lutut", angle: "Rileks", note: "Tulang kering menyentuh bar saat setup" },
    ],
    dos: [
      "Bar menempel di tulang kering dan paha sepanjang angkatan",
      "Dorong lantai menjauh — jangan menarik dengan punggung",
      "Lockout dengan mengencangkan bokong, bukan mencondongkan badan",
    ],
    donts: [
      "Punggung bawah membulat saat menahan beban",
      "Menyentak bar dari lantai",
      "Hiperekstensi di posisi atas",
    ],
  },
  {
    id: "db-row",
    name: "Dumbbell Row",
    muscleGroup: "Punggung",
    targetMuscles: ["Lats", "Rhomboid", "Bahu belakang", "Biceps"],
    equipment: "Dumbbell + Bangku",
    icon: "row",
    formCues: [
      { joint: "Siku", angle: "Tarik", note: "Dorong siku ke arah pinggul, bukan ke langit" },
      { joint: "Punggung", angle: "Netral", note: "Badan hampir sejajar lantai" },
      { joint: "Bahu", angle: "Terkunci", note: "Jangan angkat bahu ke telinga" },
    ],
    dos: [
      "Tangan yang tidak bekerja bertumpu di bangku",
      "Tahan kontraksi lat satu detik penuh di atas",
      "Turunkan dumbbell dengan terkendali",
    ],
    donts: [
      "Memutar badan untuk mengayun beban",
      "Memakai momentum dari pinggul",
      "Bahu jatuh ke depan di posisi bawah",
    ],
  },
  {
    id: "ohp",
    name: "Overhead Press",
    muscleGroup: "Bahu",
    targetMuscles: ["Deltoid", "Triceps", "Dada atas", "Core"],
    equipment: "Barbell",
    icon: "press",
    formCues: [
      { joint: "Pergelangan", angle: "Segaris", note: "Bar tepat di atas lengan bawah saat lockout" },
      { joint: "Pinggul", angle: "Bokong ON", note: "Kencangkan bokong, tulang rusuk turun" },
      { joint: "Siku", angle: "Agak depan", note: "Sedikit di depan garis bar" },
    ],
    dos: [
      "Mundurkan kepala, lalu dorong masuk saat lockout",
      "Kencangkan bokong dan kunci perut sekuatnya",
      "Mulai bar dari tinggi tulang selangka",
    ],
    donts: [
      "Mencondongkan badan sampai jadi push press",
      "Siku melebar ke samping",
      "Menekan bar melengkung menghindari wajah",
    ],
  },
  {
    id: "curl",
    name: "Bicep Curl",
    muscleGroup: "Lengan",
    targetMuscles: ["Biceps", "Brachialis", "Lengan bawah"],
    equipment: "Dumbbell / EZ Bar",
    icon: "curl",
    formCues: [
      { joint: "Siku", angle: "Menempel", note: "Tetap di sisi badan, tidak bergeser" },
      { joint: "Pergelangan", angle: "Netral", note: "Putar telapak menghadap atas saat menaikkan" },
    ],
    dos: [
      "Siku tetap menempel di badan",
      "Kontrol fase turun 2–3 detik",
      "Lengan lurus penuh di posisi bawah",
    ],
    donts: [
      "Mengayun badan untuk curang",
      "Setengah repetisi di posisi bawah",
      "Siku maju ke depan di posisi atas",
    ],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
