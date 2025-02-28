import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class UserRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
  }
  