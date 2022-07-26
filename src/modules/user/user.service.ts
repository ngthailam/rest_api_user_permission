import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto) {
    let userWithName = this.userRepo.findOneBy({
      name: createUserDto.name
    })

    if (userWithName != null) {
      throw new HttpException('User name already exist', HttpStatus.CONFLICT)
    }

    let user: User = new User()
    user.name = createUserDto.name
    return this.userRepo.save(user)
  }

  findAll() {
    return this.userRepo.find()
  }

  async findOne(id: string) {
    let user = await this.userRepo.findOneBy({ id: id })
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
}
