import { Module } from '@nestjs/common';
import { WorkoutExcerciseService } from './workout-excercise.service';

import { PrismaService } from 'src/prisma/prisma.service';
import { WorkoutExcerciseController } from './workout-excercise.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WorkoutExcerciseController],
  providers: [WorkoutExcerciseService, PrismaService],
  imports: [PrismaModule],
  exports: [WorkoutExcerciseService],
})
export class WorkoutExcerciseModule {}
