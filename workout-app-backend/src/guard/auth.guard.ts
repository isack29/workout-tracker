/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
//Implementamos canActivate
export class AuthGuard implements CanActivate { 
  //constructor donde inyectamos dependencias de jwt, reflector y configservice
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //verificamos si la ruta es public(sin token, sin autenticación)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //sí es publica devolvemos true, para que pase al controlador
    if (isPublic) {
      return true;
    }

    //verificación del token
    //extraemos el token
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    //si no hay token, se lanza excepción
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    //validamos que el token que se proveé, cumpla con el secrete de nuestra app
    let user;
    try {
      
      //obtenemos el payload
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SECRET'),
      });
      
      //pasamos el payload a user
      user = payload;
    } catch (error) {

      throw new UnauthorizedException('Invalid token');
    }

    //requeste 
    request['user'] = user;

    return true;
  }

  //método para extraer al token
  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
