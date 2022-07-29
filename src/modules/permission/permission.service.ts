import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const isPermissionExist = await this.permissionRepo.findOneBy({
      code: createPermissionDto.code,
    });
    if (isPermissionExist) {
      throw new HttpException(
        `Permission with code=${createPermissionDto.code} already exist`,
        HttpStatus.CONFLICT,
      );
    }
    const permission: Permission = new Permission();
    permission.code = createPermissionDto.code;
    permission.description = createPermissionDto.description;
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find();
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOneBy({ id: id });
    if (permission == null) {
      throw new HttpException(
        `Permission with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    // Validate if permission with given id exist, if not this
    // function throws a HttpException
    await this.findOne(id);

    // Actual update
    return this.permissionRepo.update(
      {
        id: id,
      },
      {
        code: updatePermissionDto.code,
        description: updatePermissionDto.description,
      },
    );
  }

  remove(id: number) {
    // TODO: add check to remove success, fail to give proper response object
    return this.permissionRepo.delete({ id: id });
  }

  async findByCode(code: string) {
    const permission = await this.permissionRepo.findOneBy({ code: code });
    if (permission == null) {
      throw new HttpException(
        `Permission with code=${code} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return permission;
  }
}
