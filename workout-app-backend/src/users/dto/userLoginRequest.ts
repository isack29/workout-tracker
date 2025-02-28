import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
