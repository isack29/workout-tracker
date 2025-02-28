/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { WorkoutExcerciseModule } from './workout-excercise/workout-excercise.module';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [UsersModule, PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WorkoutExcerciseModule,
    WorkoutModule, // Carga variables de entorno
     
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard }, // 👈 Ahora el guard protege toda la app
  ],
})
export class AppModule {}
