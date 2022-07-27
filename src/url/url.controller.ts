import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UrlService } from './url.service';

@UseGuards(AuthGuard('jwt'))
@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get('all')
  findAllUrl() {
    const urls = this.urlService.findAll();
    return urls;
  }

  @Post()
  async shorten(@Body('url') url: string) {
    this.urlService.validateUrl(url);
    const saved = await this.urlService.save(url);
    return saved;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.urlService.deleteById(id);
  }
}
