import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLoginRequest } from '../dto/userLoginRequest';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(userLoginRequest: UserLoginRequest) {
    
    const user = await this.prismaService.user.findUnique({
      where: { email: userLoginRequest.email },
    });
    if (!user || !(await compare(userLoginRequest.password, user.password))) {
      throw new UnauthorizedException('Email or password are wrong');
    }
    return user;
  }

  generateAccessToken(payload: object) {
    return this.jwtService.sign(payload);
  }
}
