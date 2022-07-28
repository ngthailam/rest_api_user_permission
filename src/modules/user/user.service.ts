import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly roleService: RoleService,
  ) { }

  create(createUserDto: CreateUserDto) {
    let user: User = new User()
    user.name = createUserDto.name
    return this.userRepo.save(user)
  }

  findAll() {
    return this.userRepo.find()
  }

  async findOne(id: string) {
    let user = await this.userRepo.findOne({
      where: { id: id },
      relations: ['roles']
    })
    if (user == null) {
      throw new HttpException(`User with id=${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Validate if user with given id exist, if not this
    // function throws a HttpException
    await this.findOne(id)

    // Actual update
    return this.userRepo.update({
      id: id,
    }, {
      name: updateUserDto.name
    })
  }

  remove(id: string) {
    return this.userRepo.delete({ id: id })
  }

  async addRole(updateRoleDto: UpdateUserRoleDto) {
    let user: User = await this.findOne(updateRoleDto.userId)
    let roleIdsToAdd: number[] = []

    updateRoleDto.roleIds.forEach(roleId => {
      const isAlreadyHasRole = user.roles.some(userRole => {
        return userRole.id == roleId
      })
      if (!isAlreadyHasRole) {
        roleIdsToAdd.push(roleId)
      }
    });

    let newRoles: Role[] = []

    for (const roleId of roleIdsToAdd) {
      const role = await this.roleService.findOne(roleId)
      newRoles.push(role)
    }

    user.roles = [...newRoles, ...user.roles]
    return this.userRepo.save(user)
  }

  async removeRole(updateRoleDto: UpdateUserRoleDto) {
    const user: User = await this.findOne(updateRoleDto.userId)

    user.roles = user.roles.filter((userRole: Role) => {
      const isInDeletePermissionList = updateRoleDto.roleIds.find((roleIdInner) => {
        return roleIdInner === userRole.id;
      })
      return !isInDeletePermissionList
    })

    return this.userRepo.save(user)
  }
}
