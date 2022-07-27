import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    public code: string

    @IsString()
    @IsOptional()
    public description: string
}
