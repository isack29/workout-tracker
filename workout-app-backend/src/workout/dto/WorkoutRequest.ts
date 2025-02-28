import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class WorkoutRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date)
  sheduledAt: Date;

  @IsString()
  comments?: string;
}
