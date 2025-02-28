import { IsNotEmpty, IsNumber } from 'class-validator';

export class WorkoutExerciseRequest {
  @IsNotEmpty()
  @IsNumber()
  sets: number;

  @IsNotEmpty()
  @IsNumber()
  repetitions: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
