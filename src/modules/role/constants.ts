import { SetMetadata } from "@nestjs/common";

export const roleConstants = {
    roleName: 'roleName'
} 

export const Role = (roleNames: string[]) => SetMetadata(roleConstants.roleName, roleNames);