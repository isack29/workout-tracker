/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { GlobalSuccessResponse } from 'src/globalDto/GlobalSuccessResponse';
  
  @Catch(HttpException)
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionResponse = exception.getResponse();
  
      let message = 'An unexpected error occurred';
      let data: any = null;
  
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        data = (exceptionResponse as any).data || null;
      }
  
      const errorResponse: GlobalSuccessResponse = {
        success: false,
        message,
        statusCode: status,
        data,
      };
  
      response.status(status).json(errorResponse);
    }
  }