import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenUserDto } from '../auth/dto/authen-user.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshAccessTokenDto } from '../refresh-token/dto/refresh-access-token.dto';
import { Public } from './constants';
import { RoleGuard } from './guard/role.guard';
import { Role } from '../role/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Throttle(3, 60)
  @Public()
  @Post('login')
  login(@Body() authenUserDto: AuthenUserDto) {
    return this.authService.login(authenUserDto)
  }

  @Post('logout')
  logout(@Body() logoutUserDto: LogoutUserDto) {
    return this.authService.logout(logoutUserDto)
  }

  @Public()
  @Post('refresh-token')
  refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
    return this.authService.refreshAccessToken(refreshAccessTokenDto)
  }

  @UseGuards(RoleGuard)
  @Role(['super'])
  @Get('test')
  getProfile() {
    return "success";
  }
}
