import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkoutExerciseRequest } from './dto/WorkoutExerciseRequest';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';
import { State } from '@prisma/client';
import {
  mapToWorkoutExerciseResponseFromWorkoutExercise,
  mapToWorkoutExerciseResponseList,
} from './mapper/workout-excercise.mapper';
import { mapToGlobalSuccessResponse } from 'src/globalDto/globalMapper';

@Injectable()
export class WorkoutExcerciseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    workoutId: string,
    exerciseId: string,
    userAuth: AuthenticatedRequest,
    workoutExersiceRequest: WorkoutExerciseRequest,
  ) {
    // Validar que el usuario exista
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Validar que el usuario del token coincida
    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'User ID from URL does not match token user',
      );
    }

    // Validar que el ejercicio exista
    const exercise = await this.prismaService.exercise.findUnique({
      where: { id: exerciseId, state: State.ACTIVE },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${exerciseId} not found`);
    }

    // Validar que el workout pertenezca al usuario autenticado
    const workoutByUserId = await this.prismaService.workout.findUnique({
      where: { id: workoutId, state: State.ACTIVE },
    });

    if (!workoutByUserId) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    if (workoutByUserId.userId !== userAuth.user.id) {
      throw new UnauthorizedException("You can't access this resource");
    }

    // Validar si el ejercicio ya está en el workout
    const workoutExercise = await this.prismaService.workoutExercise.findFirst({
      where: {
        exerciseId: exerciseId,
        workoutId: workoutId,
      },
    });

    if (workoutExercise?.state === State.ACTIVE) {
      throw new BadRequestException(
        'You already have this exercise in this workout',
      );
    }

    // Si existe pero está inactivo, se reactiva
    if (workoutExercise) {
      const updatedWorkoutExercise =
        await this.prismaService.workoutExercise.update({
          where: { id: workoutExercise.id },
          data: {
            sets: workoutExersiceRequest.sets,
            repetitions: workoutExersiceRequest.repetitions,
            weight: workoutExersiceRequest.weight, // Corregido el nombre
            state: State.ACTIVE,
          },
        });

      const responseUpdt = mapToWorkoutExerciseResponseFromWorkoutExercise(
        updatedWorkoutExercise,
        exercise,
      );
      return mapToGlobalSuccessResponse(
        HttpStatus.CREATED,
        'Workout exercise reactivated',
        responseUpdt,
      );
    }

    // Si no existe, se crea uno nuevo
    const newWorkoutExercise = await this.prismaService.workoutExercise.create({
      data: {
        sets: workoutExersiceRequest.sets,
        repetitions: workoutExersiceRequest.repetitions,
        weight: workoutExersiceRequest.weight, // Corregido el nombre
        exerciseId: exerciseId,
        workoutId: workoutId,
        state: State.ACTIVE,
      },
    });

    const exerciseWorkoutResponse =
      mapToWorkoutExerciseResponseFromWorkoutExercise(
        newWorkoutExercise,
        exercise,
      );
    return mapToGlobalSuccessResponse(
      HttpStatus.CREATED,
      'Workout exercise created',
      exerciseWorkoutResponse,
    );
  }

  async findAllWorkoutExerciseByWorkoutId(
    userId: string,
    workoutId: string,
    userAuth: AuthenticatedRequest,
    page: number,
    pageSize: number,
  ) {
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('user with id' + userId + 'not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'user id from url doesnt mathc user token',
      );
    }

    const workoutByUserId = await this.prismaService.workout.findUnique({
      where: { id: workoutId, state: State.ACTIVE },
    });

    if (!workoutByUserId) {
      throw new NotFoundException(
        'workout with id ' + workoutId + ' not found',
      );
    }

    if (workoutByUserId.userId !== userAuth.user.id) {
      throw new UnauthorizedException('u cant access to this resource ');
    }

    const totalWorkoutExercise = await this.prismaService.workoutExercise.count(
      {
        where: { workoutId: workoutId, state: State.ACTIVE },
      },
    );

    const totalPages = Math.ceil(totalWorkoutExercise / pageSize);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const workoutExercises = await this.prismaService.workoutExercise.findMany({
      where: { workoutId: workoutId, state: State.ACTIVE },
      skip: skip,
      take: take,
    });

    if (workoutExercises.length === 0) {
      throw new NotFoundException(
        `No workout exercises found for workout ID ${workoutId}`,
      );
    }

    // Obtener los ejercicios correspondientes
    const exerciseIds = workoutExercises.map((we) => we.exerciseId);
    const exercises = await this.prismaService.exercise.findMany({
      where: { id: { in: exerciseIds } },
    });

    // Mapear la lista de ejercicios
    const workoutExercisesResponse = mapToWorkoutExerciseResponseList(
      workoutExercises,
      exercises,
    );

    const response = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'Workout exercises found',
      workoutExercisesResponse,
    );

    return {
      response,
      totalWorkoutExercise,
      totalPages,
      currentPage: page,
    };
  }

  async findWorkoutExcersiceById(
    userId: string,
    workoutExerciseId: string,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('user with id' + userId + 'not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'user id from url doesnt mathc user token',
      );
    }

    const workoutExcerciseById =
      await this.prismaService.workoutExercise.findUnique({
        where: { id: workoutExerciseId, state: State.ACTIVE },
      });

    if (!workoutExcerciseById) {
      throw new NotFoundException(
        ' workoutExcercise with id ' + workoutExerciseId + 'is not found',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workoutExcerciseById.workoutId, state: State.ACTIVE },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workoutExcerciseById.workoutId + ' not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException(' u can´t access to this resource');
    }

    const excercise = await this.prismaService.exercise.findUnique({
      where: { id: workoutExcerciseById.exerciseId, state: State.ACTIVE },
    });

    if (!excercise) {
      throw new NotFoundException(
        'excercise with id' + workoutExcerciseById.exerciseId + 'not found',
      );
    }

    const exerciseWorkoutResponse =
      mapToWorkoutExerciseResponseFromWorkoutExercise(
        workoutExcerciseById,
        excercise,
      );

    const response = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'Exercise found',
      exerciseWorkoutResponse,
    );

    return response;
  }

  async updateWorkoutExercise(
    userId: string,
    exerciseId: string,
    workoutId: string,
    workoutExcersiceId: string,
    userAuth: AuthenticatedRequest,
    workoutExcersiceRequest: WorkoutExerciseRequest,
  ) {
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('user with id' + userId + 'not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'user id from url doesnt mathc user token',
      );
    }

    const excercise = await this.prismaService.exercise.findUnique({
      where: { id: exerciseId, state: State.ACTIVE },
    });

    if (!excercise) {
      throw new NotFoundException(
        'excercise with id' + exerciseId + 'not found',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workoutId, state: State.ACTIVE },
    });

    if (!workout) {
      throw new NotFoundException(
        'workout with id ' + workoutId + ' not found',
      );
    }

    if (workout.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    const workoutExcercise =
      await this.prismaService.workoutExercise.findUnique({
        where: { id: workoutExcersiceId, state: State.ACTIVE },
      });

    if (!workoutExcercise) {
      throw new NotFoundException(
        'workoutExcercise with id ' + workoutExcersiceId + ' not found',
      );
    }

    const workoutExcerciseUpdate =
      await this.prismaService.workoutExercise.update({
        where: { id: workoutExcersiceId },
        data: {
          sets: workoutExcersiceRequest.sets,
          repetitions: workoutExcersiceRequest.repetitions,
          weight: workoutExcersiceRequest.weight,
          workoutId: workoutId,
          exerciseId: exerciseId,
        },
      });

    const workoutExcerciseResponse =
      mapToWorkoutExerciseResponseFromWorkoutExercise(
        workoutExcerciseUpdate,
        excercise,
      );

    return mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workoutExcersice updated',
      workoutExcerciseResponse,
    );
  }

  async removeWorkoutExcersice(
    userId: string,
    workoutExerciseId: string,
    userAuth: AuthenticatedRequest,
  ) {
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId, state: State.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('user with id' + userId + 'not found');
    }

    if (userFound.email !== userAuth.user.email) {
      throw new UnauthorizedException(
        'user id from url doesnt mathc user token',
      );
    }

    const workoutExcercise =
      await this.prismaService.workoutExercise.findUnique({
        where: { id: workoutExerciseId, state: State.ACTIVE },
      });

    if (!workoutExcercise) {
      throw new NotFoundException(
        'workoutExcercise with id ' + workoutExerciseId + ' not found',
      );
    }

    const workout = await this.prismaService.workout.findUnique({
      where: { id: workoutExcercise.workoutId, state: State.ACTIVE },
    });

    if (workout?.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    const workoutExcerciseDelete =
      await this.prismaService.workoutExercise.update({
        where: { id: workoutExerciseId },
        data: { state: State.INACTIVE },
      });

    const excercise = await this.prismaService.exercise.findUnique({
      where: { id: workoutExcerciseDelete.exerciseId, state: State.ACTIVE },
    });

    if (!excercise) {
      throw new NotFoundException('Exercise not found');
    }

    const workoutExcerciseResponse =
      mapToWorkoutExerciseResponseFromWorkoutExercise(
        workoutExcerciseDelete,
        excercise,
      );

    return mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'workoutExcersice deleted',
      workoutExcerciseResponse,
    );
  }
}
