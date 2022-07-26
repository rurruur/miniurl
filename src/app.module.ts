import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Url } from './entity/url.entity';
import { UrlModule } from './url/url.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FortyTwoStrategy } from './auth/fortyTwo.strategy';
import { Users } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.POSTGRES_HOST || process.env.DB_HOST,
      port: +process.env.POSTGRES_PORT || +process.env.DB_PORT,
      username: process.env.POSTGRES_USERNAME || process.env.DB_ID,
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASS,
      database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
      entities: [Url, Users],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    UrlModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, FortyTwoStrategy],
})
export class AppModule {}
