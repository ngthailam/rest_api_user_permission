import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenUserDto {
    @IsNotEmpty({
        message: 'name must not be empty'
    })
    @IsString()
    public name: string

    @IsNotEmpty()
    @IsString()
    public password: string
}
