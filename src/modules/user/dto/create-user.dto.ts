import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'name must not be empty',
  })
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
