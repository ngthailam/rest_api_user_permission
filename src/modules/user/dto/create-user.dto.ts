import {
    IsNotEmpty, IsString, IsUUID
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({
        message: 'Name must not be empty'
    })
    @IsString()
    name: string;
}
