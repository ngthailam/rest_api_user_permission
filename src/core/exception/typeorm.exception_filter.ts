import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common/interfaces/";
import { Request, Response } from 'express';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError, TypeORMError } from "typeorm";

@Catch()
export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message.message;

        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        console.log(exception)
        switch (exception.constructor) {
            case QueryFailedError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                break;
            case EntityNotFoundError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                break;
            case CannotCreateEntityIdMapError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                break;
            case TypeORMError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as TypeORMError).message;
                break;
            case HttpException:
                status = (exception as HttpException).getStatus();
                message = (exception as HttpException).message;
                break;
            default:
                if (exception.response) {
                    response.status(exception.response.statusCode || status).json({
                        'statusCode': exception.response.statusCode || status,
                        'message': exception.response.message || 'Unknown Error'
                    });
                } else {
                    message = 'Unknown error'
                }
        }

        response.status(status).json({
            'statusCode': status,
            'message': message,
        });
    }
}