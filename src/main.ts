import { BadRequestException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './core/exception/typeorm.exception_filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    transform: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      if (validationErrors.length == 0) {
        return new InternalServerErrorException()
      }
      let errorConstraintMsg = validationErrors[0]?.constraints;
      // To return message as a String instead of an Array
      let errorMsg = errorConstraintMsg[Object.keys(errorConstraintMsg)[0]]
      return new BadRequestException(errorMsg);
    },
  }))
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(3000);
}
bootstrap();
