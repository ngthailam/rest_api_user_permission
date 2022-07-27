import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { isEmpty } from 'class-validator';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll(@Query('code') code: string) {
    if (code != null) {
      return this.permissionService.findByCode(code);
    }
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.permissionService.findOne(id);
  }

  @Get('')
  findByCode(@Param('code') code: string) {
    return this.permissionService.findByCode(code);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.permissionService.remove(id);
  }
}
