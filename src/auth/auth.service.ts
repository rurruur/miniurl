import { Injectable } from '@nestjs/common';
import { Users } from 'src/entity/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: Users) {
    return {
      jwt: this.jwtService.sign({ username: user.login, sub: user.id }),
    };
  }

  async getAccessToken(code: string) {
    const redirect = `${process.env.API_URL}auth/oauth/callback`;
    const apiUrl = `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.UID_42}&client_secret=${process.env.SECRET_42}&code=${code}&redirect_uri=${redirect}`;
    const result = await fetch(apiUrl, {
      method: 'POST',
    });
    return (await result.json()).access_token;
  }
}
