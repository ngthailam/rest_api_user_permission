import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateUserRoleDto {
    @IsString()
    @IsNotEmpty()
    public userId: string

    @IsNumber({}, { each: true })
    public roleIds: number[]
}