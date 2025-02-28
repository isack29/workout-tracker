import {
  Exercise,
  Workout,
  WorkoutExercise,
} from '@prisma/client';
import { WorkoutExerciseResponse } from 'src/workout-excercise/dto/WorkoutExerciseResponse';
import { WorkoutResponse } from '../dto/WorkoutResponse';
import { ExerciseResponse } from 'src/workout-excercise/dto/ExerciseResponse';


// ✅ Mapear un Exercise a ExerciseResponse
function mapExerciseToResponse(exercise: Exercise): ExerciseResponse {
  return {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description ?? '',
    category: exercise.category,
    muscleGroup: exercise.muscleGroup,
    imageUrl: exercise.imageUrl || undefined,
  };
}

// ✅ Mapear un WorkoutExercise a WorkoutExerciseResponse
function mapWorkoutExerciseToResponse(
  workoutExercise: WorkoutExercise & { exercise: Exercise },
): WorkoutExerciseResponse {
  return {
    id: workoutExercise.id,
    ExcerciseResponse: mapExerciseToResponse(workoutExercise.exercise),
    sets: workoutExercise.sets,
    repetitions: workoutExercise.repetitions,
    wheigth: workoutExercise.weight ?? 0,
  };
}

// ✅ Mapear un Workout a WorkoutResponse
export function mapWorkoutToResponse(workout: Workout & { exercises: (WorkoutExercise & { exercise: Exercise })[] }): WorkoutResponse {
  return {
    id: workout.id,
    name: workout.name,
    sheduledAt: workout.scheduledAt,
    comments: workout.comments || undefined,
    workoutExercises: workout.exercises.map(mapWorkoutExerciseToResponse), // ✅ Cambiado de workoutExerciseResponse a workoutExercises
  };
}



