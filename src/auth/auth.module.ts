import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy]
})
export class AuthModule { }
