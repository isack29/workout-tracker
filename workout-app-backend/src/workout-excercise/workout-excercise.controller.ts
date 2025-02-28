import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import { WorkoutExcerciseService } from './workout-excercise.service';
import { WorkoutExerciseRequest } from './dto/WorkoutExerciseRequest';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';

@Controller('user-workoutExercise')
export class WorkoutExcerciseController {
  constructor(
    private readonly workoutExcerciseService: WorkoutExcerciseService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(':userId/workout/:workoutId/exercise/:exerciseId')
  create(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Param('exerciseId') exerciseId: string,
    @Req() userAuth: AuthenticatedRequest,
    @Body() workoutExcersiceRequest: WorkoutExerciseRequest,
  ) {
    return this.workoutExcerciseService.create(
      userId,
      workoutId,
      exerciseId,
      userAuth,
      workoutExcersiceRequest,
    );
  }

  @Get(':userId/workout/:workoutId')
  findAllWorkoutExerciseByWorkoutId(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Req() userAuth: AuthenticatedRequest,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    return this.workoutExcerciseService.findAllWorkoutExerciseByWorkoutId(
      userId,
      workoutId,
      userAuth,
      pageNumber,
      size,
    );
  }

  @Get(':userId/workoutExercise/:workoutExerciseId')
  findWorkoutExerciseById(
    @Param('userId') userId: string,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutExcerciseService.findWorkoutExcersiceById(
      userId,
      workoutExerciseId,
      userAuth,
    );
  }

  @Patch(
    ':userId/workout/:workoutId/exercise/:exerciseId/workoutExercise/:workoutExerciseId',
  )
  update(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Param('exerciseId') exerciseId: string,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Req() userAuth: AuthenticatedRequest,
    @Body() workoutExcersiceRequest: WorkoutExerciseRequest,
  ) {
    return this.workoutExcerciseService.updateWorkoutExercise(
      userId,
      exerciseId,
      workoutId,
      workoutExerciseId,
      userAuth,
      workoutExcersiceRequest,
    );
  }

  @Delete(':userId/workoutExercise/:workoutExerciseId')
  remove(
    @Param('userId') userId: string,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutExcerciseService.removeWorkoutExcersice(userId, workoutExerciseId, userAuth);
  }
}
