import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WorkoutController],
  providers: [WorkoutService, PrismaService],
  imports: [PrismaModule],
  exports: [WorkoutService]
})
export class WorkoutModule {}
