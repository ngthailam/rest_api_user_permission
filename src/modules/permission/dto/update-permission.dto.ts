import { PartialType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @IsInt()
    public id: number
}
