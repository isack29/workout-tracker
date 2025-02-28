import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { UserRequest } from './dto/userRequest';
import { encrypt } from 'src/libs/bcrypt';
import { mapToUserAuthResponseFromUser } from './mappers/users.mappers';
import { mapToGlobalSuccessResponse } from 'src/globalDto/globalMapper';
import { UserLoginRequest } from './dto/userLoginRequest';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  //Métod para crear un usuario en el sistema
  async createUser(userRequest: UserRequest) {
    //validare si el usuario existe ya, para no crearo
    const userFind = await this.prismaService.user.findUnique({
      where: { email: userRequest.email },
    });

    // sí el usuario existe se lanza una excepción
    if (userFind) {
      throw new BadRequestException('User already exists');
    }

    //hasheamos contraseña
    const passwordHashed = await encrypt(userRequest.password);

    //creamos el usuario
    const userCreated = await this.prismaService.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: passwordHashed,
        state: 'ACTIVE',
      },
    });

    //generamos el token con la ayuda de authService
    //usa el servicio authService para generar el token
    const access_token = this.authService.generateAccessToken({
      id: userCreated.id,
      email: userCreated.email,
    });

    //mapea a userAuthResponse
    const userAuthResponse = mapToUserAuthResponseFromUser(
      userCreated,
      access_token,
    );

    return mapToGlobalSuccessResponse(
      HttpStatus.CREATED,
      'User created successfully',
      userAuthResponse,
    );
  }

  async login(userLoginRequest: UserLoginRequest) {
    const user = await this.authService.validateUser(userLoginRequest);

    const token = this.authService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const userAuthResponse = mapToUserAuthResponseFromUser(user, token);

    return mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'User logged in successfully',
      userAuthResponse,
    );
  }

  async findById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
