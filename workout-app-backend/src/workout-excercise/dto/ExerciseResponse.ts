export class ExerciseResponse {

  id: string;
  name: string;
  description: string;
  category: string; // Puede ser "cardio", "strength", "flexibility", etc.
  muscleGroup: string;
  imageUrl?: string;
}
