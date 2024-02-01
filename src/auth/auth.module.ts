import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/app/mail/mail.module';
import { AuthController } from './auth.controller';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { ResetPassword } from './reset_password.entity';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User, ResetPassword]), JwtModule.register({}), MailModule],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy]
})
export class AuthModule { }
