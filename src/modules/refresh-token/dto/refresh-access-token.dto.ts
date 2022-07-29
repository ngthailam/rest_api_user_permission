import { IsNotEmpty, IsString } from "class-validator";

export class RefreshAccessTokenDto {
    @IsNotEmpty()
    @IsString()
    public refreshToken: string

    // TODO: maybe fetched from header
    @IsNotEmpty()
    @IsString()
    public userId: string
}