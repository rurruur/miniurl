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

// @UseGuards(AuthGuard('jwt'))
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
    const saved = await this.urlService.save({ pre: url, after: '' });
    return saved;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    console.log('hi');
    this.urlService.deleteById(id);
  }
}
