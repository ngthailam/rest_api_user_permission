import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionService } from '../permission/permission.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private permissionService: PermissionService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const isRoleExist = await this.roleRepo.findOneBy({
      name: createRoleDto.name,
    });
    if (isRoleExist) {
      throw new HttpException(
        `Role with name=${createRoleDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    }
    const role: Role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: {
        id: id,
      },
      relations: ['permissions'],
    });
    if (role == null) {
      throw new HttpException(
        `Role with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return role;
  }

  async findByName(name: string) {
    const role = await this.roleRepo.findOne({
      where: {
        name: name,
      },
      relations: ['permissions'],
    });
    if (role == null) {
      throw new HttpException(
        `Permission with name=${name} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Validate if role with given id exist, if not this
    // function throws a HttpException
    await this.findOne(id);

    // Actual update
    return this.roleRepo.update(
      {
        id: id,
      },
      {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
      },
    );
  }

  // TODO: needs to add to a transaction instead
  // TODO: logic to complicated for just a simple task, refactor this
  async addPermissions(updateRolePermissionDto: UpdateRolePermissionDto) {
    const role: Role = await this.findOne(updateRolePermissionDto.roleId);
    const permissionIdsToAdd: number[] = [];

    updateRolePermissionDto.permissionIds.forEach((permissionId) => {
      const isAlreadyHasPermission = role.permissions.some((rolePermission) => {
        return rolePermission.id == permissionId;
      });
      if (!isAlreadyHasPermission) {
        permissionIdsToAdd.push(permissionId);
      }
    });

    const newPermissions: Permission[] = [];

    for (const permissionId of permissionIdsToAdd) {
      const permission = await this.permissionService.findOne(permissionId);
      newPermissions.push(permission);
    }

    role.permissions = [...newPermissions, ...role.permissions];
    return this.roleRepo.save(role);
  }

  // TODO: needs to add to a transaction instead
  async removePermissions(updateRolePermissionDto: UpdateRolePermissionDto) {
    const role: Role = await this.findOne(updateRolePermissionDto.roleId);

    role.permissions = role.permissions.filter((rolePermission: Permission) => {
      const isInDeletePermissionList =
        updateRolePermissionDto.permissionIds.find((permissionIdInner) => {
          return permissionIdInner === rolePermission.id;
        });
      return !isInDeletePermissionList;
    });

    return this.roleRepo.save(role);
  }

  remove(id: number) {
    return this.roleRepo.delete({ id: id });
  }
}
