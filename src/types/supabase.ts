
// Types for Supabase entities
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  user_type: 'aluno' | 'professor' | 'nutricionista';
  created_at: string;
  dietary_restrictions?: string | null;
}

export interface MealAttendance {
  id: string;
  student_id: string;
  date: string;
  breakfast: boolean | null;
  lunch: boolean | null;
  snack: boolean | null;
  created_at: string;
}

export interface DailyMenu {
  id: string;
  date: string;
  breakfast: string | null;
  lunch: string | null;
  snack: string | null;
  created_by: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  student_id: string;
  profile_id?: string;
  feedback_type: string; // Changed from 'comment' | 'suggestion' to string to match Supabase
  meal_type: string; // Changed from 'breakfast' | 'lunch' | 'snack' to string to match Supabase
  content: string;
  created_at: string;
  date?: string;
}
