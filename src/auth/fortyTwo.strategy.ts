import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      clientID: process.env.UID_42,
      clientSecret: process.env.SECRET_42,
      callbackURL: `${process.env.API_URL}auth/oauth/callback`,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ) {
    const { email, login, first_name, last_name } = profile;
    const user = {
      email,
      login,
      first_name,
      last_name,
      accessToken,
    };
    console.log(user);
    cb(null, user);
  }
}
