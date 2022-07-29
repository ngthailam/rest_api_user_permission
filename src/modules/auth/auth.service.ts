import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthenUserDto } from './dto/authen-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshAccessTokenDto } from '../refresh-token/dto/refresh-access-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
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
    await this.refreshTokenService.removeByUserId(user.id)
    const payload = {
      id: user.id,
    };
    const refreshToken = await this.refreshTokenService.create(user.id)
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken.rawToken
    };
  }

  logout(logoutUserDto: LogoutUserDto) {
    return this.refreshTokenService.removeByUserId(logoutUserDto.userId)
  }

  async refreshAccessToken(refreshTokenDto: RefreshAccessTokenDto) {
    // Check match refresh token
    const savedRefreshToken = await this.refreshTokenService.findOneByUserId(refreshTokenDto.userId)
    if (!savedRefreshToken) {
      throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED)
    }
    const isMatch = await bcrypt.compare(refreshTokenDto.refreshToken, savedRefreshToken.hashedToken);
    if (!isMatch) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED)
    }

    // Check if refresh token is expired
    const duration = Date.now().valueOf() - (+savedRefreshToken.createdAt).valueOf();
    const expireDuration = 1000 * 60 * 60 * 24 // 24 hour
    if (duration > expireDuration) {
      throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED)
    }

    // Create a new refresh token
    await this.refreshTokenService.remove(savedRefreshToken.id)
    const refreshToken = await this.refreshTokenService.create(refreshTokenDto.userId)

    // Create a new access token
    const payload = {
      id: refreshTokenDto.userId,
    };
    const accessToken: string = this.jwtService.sign(payload)
    return {
      access_token: accessToken,
      refresh_token: refreshToken.rawToken
    };
  }
}
