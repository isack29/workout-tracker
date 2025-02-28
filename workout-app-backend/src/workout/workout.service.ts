import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkoutRequest } from './dto/WorkoutRequest';
import { PrismaService } from 'src/prisma/prisma.service';
import { State, WorkoutStatus } from '@prisma/client';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';
import { mapToGlobalSuccessResponse } from 'src/globalDto/globalMapper';
import { mapWorkoutToResponse } from './mapper/workout.mapper';

@Injectable()
export class WorkoutService {
  constructor(private readonly prismaService: PrismaService) {}
  async createWorkout(
    userId: string,
    workoutRequest: WorkoutRequest,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('user with id ' + userId + ' not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'user id from url doesnt mathc user token',
      );
    }

    const workoutCreate = await this.prismaService.workout.create({
      data: {
        userId: userId,
        name: workoutRequest.name,
        scheduledAt: workoutRequest.sheduledAt,
        workoutStatus: WorkoutStatus.PENDING,
        comments: workoutRequest.comments,
        state: State.ACTIVE,
      },
    });

    const response = mapToGlobalSuccessResponse(
      HttpStatus.CREATED,
      'workout created',
      workoutCreate,
    );
    return response;
  }

  async findAllByUserIdAndWorkoutStatus(
    userId: string,
    workoutStatus: WorkoutStatus,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('user with id' + userId + ' not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    const workouts = await this.prismaService.workout.findMany({
      where: {
        userId: userId,
        workoutStatus: workoutStatus,
        state: State.ACTIVE,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (workouts.length === 0) {
      throw new NotFoundException(
        'workouts with status ' +
          workoutStatus +
          ' and user id' +
          userId +
          'nor foud',
      );
    }

    const formattedWorkouts = workouts.map((workout) => ({
      ...workout,
      workoutExercises: workout.exercises,
    }));

    const response = formattedWorkouts.map(mapWorkoutToResponse);

    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workouts found',
      response,
    );

    return responseFinal;
  }

  async findAllByUserId(userId: string, userAuth: AuthenticatedRequest) {
    // Buscar al usuario y validar si existe y está activo
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('User with id ' + userId + ' not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    // Buscar los workouts del usuario con sus ejercicios asociados
    const workouts = await this.prismaService.workout.findMany({
      where: { userId, state: State.ACTIVE },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (workouts.length === 0) {
      throw new NotFoundException(
        'User with id ' + userId + ' has no workouts',
      );
    }

    const formattedWorkouts = workouts.map((workout) => ({
      ...workout,
      workoutExercises: workout.exercises,
    }));

    const response = formattedWorkouts.map(mapWorkoutToResponse);

    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workouts found',
      response,
    );

    return responseFinal;
  }

  async findOne(
    userId: string,
    workoutId: string,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('User with id ' + userId + ' not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workoutId, state: State.ACTIVE },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workoutId + ' is not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resorce");
    }

    const response = mapWorkoutToResponse(workout);
    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workot found',
      response,
    );
    return responseFinal;
  }

  async update(
    userId: string,
    workourtId: string,
    workoutRequest: WorkoutRequest,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('User with id ' + userId + ' not found');
    }

    // Validar si el usuario autenticado es el mismo que solicita los datos
    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workourtId, state: State.ACTIVE },
      include: {
        exercises: {
          include: {
            exercise: true, // ✅ Traer la información del ejercicio
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workourtId + ' is not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resorce");
    }

    const updatedWorkout = await this.prismaService.workout.update({
      where: { id: workourtId, state: State.ACTIVE },
      data: {
        name: workoutRequest.name ?? workout.name,
        scheduledAt: workoutRequest.sheduledAt ?? workout.scheduledAt,
        comments: workoutRequest.comments ?? workout.comments,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    const response = mapWorkoutToResponse(updatedWorkout);
    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workot updated',
      response,
    );
    return responseFinal;
  }

  async updateWorkoutStatus(
    userId: string,
    workourtId: string,
    workoutStatus: WorkoutStatus,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('User with id ' + userId + ' not found');
    }

    // Validar si el usuario autenticado es el mismo que solicita los datos
    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workourtId, state: State.ACTIVE },
      include: {
        exercises: {
          include: {
            exercise: true, // ✅ Traer la información del ejercicio
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workourtId + ' is not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resorce");
    }

    const WorkoutUpdated = await this.prismaService.workout.update({
      where: { id: workourtId, state: State.ACTIVE },
      data: {
        workoutStatus: workoutStatus,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    const response = mapWorkoutToResponse(WorkoutUpdated);
    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workot status updated',
      response,
    );
    return responseFinal;
  }

  async remove(
    userId: string,
    workourtId: string,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new BadRequestException('User with id ' + userId + ' not found');
    }

    // Validar si el usuario autenticado es el mismo que solicita los datos
    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workourtId, state: State.ACTIVE },
      include: {
        exercises: {
          include: {
            exercise: true, // ✅ Traer la información del ejercicio
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workourtId + ' is not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resorce");
    }

    const deletedWorkout = await this.prismaService.workout.update({
      where: { id: workourtId, state: State.ACTIVE },
      data: {
        state: State.INACTIVE,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    const response = mapWorkoutToResponse(deletedWorkout);
    const responseFinal = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workot deleted',
      response,
    );
    return responseFinal;
  }
}
