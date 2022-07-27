import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}
 
  create(createRoleDto: CreateRoleDto) {
    let isRoleExist = this.findByName(createRoleDto.name)
    if (isRoleExist) {
      throw new HttpException(`Role with name=${createRoleDto.name} already exist`, HttpStatus.CONFLICT)
    }
    let role: Role = new Role()
    role.name = createRoleDto.name
    return this.roleRepo.save(role)
  }

  findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    let role = await this.roleRepo.findOneBy({ id: id })
    if (role == null) {
      throw new HttpException(`Role with id=${id} not found`, HttpStatus.NOT_FOUND);
    }
    return role
  }

  async  findByName(name: string) {
    let role = await this.roleRepo.findOneBy({ name: name })
    if (role == null) {
      throw new HttpException(`Permission with name=${name} not found`, HttpStatus.NOT_FOUND);
    }
    return role
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Validate if role with given id exist, if not this
    // function throws a HttpException
    await this.findOne(id)

    // Actual update
    return this.roleRepo.update({
      id: id,
    }, {
      name: updateRoleDto.name,
    })
  }

  remove(id: number) {
    return this.roleRepo.delete({ id: id });
  }
}
