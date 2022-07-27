import { IsArray, IsNotEmpty, IsNumber } from "class-validator"

export class UpdateRolePermissionDto {
    @IsNumber()
    public roleId: number

    @IsNumber({}, { each: true })
    public permissionIds: number[]
}