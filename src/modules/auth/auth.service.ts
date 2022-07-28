import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthenUserDto } from './dto/authen-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(authenUserDto: AuthenUserDto) {
    const user: User = await this.userService.findByName(authenUserDto.name)
    const isMatch = await bcrypt.compare(authenUserDto.password, user.password);
    if (isMatch) {
      return user
    } else {
      throw new UnauthorizedException()
    }
  }

  async login(authenUserDto: AuthenUserDto) {
    const user: User = await this.validateUser(authenUserDto)
    const payload = {
      id: user.id,
      name: user.name
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
