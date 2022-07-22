import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from 'src/entity/url.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  providers: [UrlService, JwtStrategy],
  controllers: [UrlController],
  exports: [UrlService],
})
export class UrlModule {}
