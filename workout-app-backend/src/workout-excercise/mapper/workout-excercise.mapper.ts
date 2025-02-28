import { Exercise, WorkoutExercise } from '@prisma/client';
import { WorkoutExerciseResponse } from '../dto/WorkoutExerciseResponse';
import { ExerciseResponse } from '../dto/ExerciseResponse';
import { NotFoundException } from '@nestjs/common';

export const mapToWorkoutExerciseResponseFromWorkoutExercise = (
  workoutExercise: WorkoutExercise,
  exercise: Exercise,
) => {
  const exerciseResponse: ExerciseResponse = {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description ?? 'No description',
    category: exercise.category,
    muscleGroup: exercise.muscleGroup,
    imageUrl: exercise.imageUrl ?? 'no image',
  };

  const response: WorkoutExerciseResponse = {
    id: workoutExercise.id,
    ExcerciseResponse: exerciseResponse,
    sets: workoutExercise.sets,
    repetitions: workoutExercise.repetitions,
    wheigth: parseFloat(String(workoutExercise.weight)) ?? 'no wheigth',
  };

  return response;
};

export const mapToWorkoutExerciseResponseList = (
  workoutExercises: WorkoutExercise[],
  exercises: Exercise[],
): WorkoutExerciseResponse[] => {
  return workoutExercises.map((workoutExercise) => {
    const exercise = exercises.find(
      (ex) => ex.id === workoutExercise.exerciseId,
    );

    if (!exercise) {
      throw new NotFoundException(
        `Exercise with id ${workoutExercise.exerciseId} not found`,
      );
    }

    return {
      id: workoutExercise.id,
      ExcerciseResponse: {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description ?? 'No description',
        category: exercise.category,
        muscleGroup: exercise.muscleGroup,
        imageUrl: exercise.imageUrl ?? 'no image',
      },
      sets: workoutExercise.sets,
      repetitions: workoutExercise.repetitions,
      wheigth: parseFloat(String(workoutExercise.weight)) ?? 'no wheigth',
    };
  });
};
