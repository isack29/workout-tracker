import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/guard/auth.guard';
import { UserRequest } from './dto/userRequest';
import { UserLoginRequest } from './dto/userLoginRequest';

@Controller('auth')
export class UsersControllers {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('sign-up')
  create(@Body() userRequest: UserRequest) {
    return this.usersService.createUser(userRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('log-in')
  logIn(@Body() userLoginRequest: UserLoginRequest) {
    return this.usersService.login(userLoginRequest);
  }
}
