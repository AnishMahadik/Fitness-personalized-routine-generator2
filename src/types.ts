export interface User {
  id: number;
  username: string;
}

export interface HistoryItem {
  id: number;
  user_id: number;
  plan: FitnessPlan;
  created_at: string;
}

export interface UserProfile {
  age: number;
  gender: string;
  weight: number; // in kg
  height: number; // in cm
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_health';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  daysPerWeek: number;
  sessionDuration: number; // in minutes
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  instructions: string;
  targetMuscle: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface FitnessPlan {
  planName: string;
  overview: string;
  weeklySchedule: WorkoutDay[];
  nutritionAdvice: string[];
  proTips: string[];
}
