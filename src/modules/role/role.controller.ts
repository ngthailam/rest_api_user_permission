import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(+id);
  }

  @Post('/permission')
  addPermission(@Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.roleService.addPermissions(updateRolePermissionDto)
  }

  @Delete('/permission')
  removePermission(@Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.roleService.removePermissions(updateRolePermissionDto)
  }
}
