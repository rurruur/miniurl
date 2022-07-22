import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
  ) {}

  @Get()
  hello() {
    return this.appService.getHello();
    // return process.env.API_URL;
  }

  @Get('login')
  @UseGuards(AuthGuard('42'))
  login() {
    // const redirect = 'http://localhost:3000/users/oauth/callback';
    // const apiUrl = `https://api.intra.42.fr/oauth/authorize?clilent_id=${process.env.UID_42}&redirect_uri=${redirect}`;
    // const result = await fetch(apiUrl, { method: 'GET' });
    // console.log(result);
    // console.log(await result.json());
    // console.log(req);
    // return req.user;
  }

  @Get(':miniUrl')
  redirect(@Param('miniUrl') miniUrl: string) {
    const original = this.urlService.getOriginal(miniUrl);
    return original;
  }
}
