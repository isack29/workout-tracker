import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseEnumPipe,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutRequest } from './dto/WorkoutRequest';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';
import { WorkoutStatus } from '@prisma/client';

@Controller('user')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post(':userId/workout')
  create(
    @Param('userId') userId: string,
    @Body() workoutRequest: WorkoutRequest,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.createWorkout(userId, workoutRequest, userAuth);
  }

  @Get(':userId/workout')
  findAll(
    @Param('userId') userId: string,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.findAllByUserId(userId, userAuth);
  }

  @Get(':userId/workout/:workoutStatus')
  findAllByWorkoutStatus(
    @Param('userId') userId: string,
    @Param('workoutStatus') workoutStatus: WorkoutStatus,
    @Req() UserAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.findAllByUserIdAndWorkoutStatus(
      userId,
      workoutStatus,
      UserAuth,
    );
  }

  @Get(':userId/workout/:workoutId')
  findOne(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.findOne(userId, workoutId, userAuth);
  }

  @Patch(':userId/workout/:workoutId')
  update(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() workoutRequest: WorkoutRequest,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.update(
      userId,
      workoutId,
      workoutRequest,
      userAuth,
    );
  }

  @Patch(':userId/workout/:workoutId/workoutStatus/:workoutStatus')
  updateWorkoutStatus(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Param('workoutStatus', new ParseEnumPipe(WorkoutStatus))
    workoutStatus: WorkoutStatus,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.updateWorkoutStatus(
      userId,
      workoutId,
      workoutStatus,
      userAuth,
    );
  }

  @Delete(':userId/workout/:workoutId')
  remove(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.workoutService.remove(userId, workoutId, userAuth);
  }
}
