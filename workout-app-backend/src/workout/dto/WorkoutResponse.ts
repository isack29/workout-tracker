import { WorkoutExerciseResponse } from 'src/workout-excercise/dto/WorkoutExerciseResponse';

export class WorkoutResponse {
  id: string;
  name: string;
  workoutExercises: WorkoutExerciseResponse[]; // 🛑 Cambia el nombre para coincidir con el modelo de Prisma
  sheduledAt: Date | null;
  comments?: string;
}