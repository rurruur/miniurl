import { Controller, Get, Query } from '@nestjs/common';
import { UserDto } from 'src/dto/user.interface';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('oauth/callback')
  async getJwtToken(@Query('code') code: string) {
    const accessToken = await this.authService.getAccessToken(code);
    const user: UserDto = await this.usersService.getUserInfo(accessToken);
    const createdUser = await this.usersService.save(user);
    const jwt = this.authService.login(createdUser);
    return jwt;
  }
}
