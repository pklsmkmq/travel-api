import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from 'src/app/mail/mail.service';
import { jwt_config } from 'src/config/jwt.config';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { User } from './auth.entity';
import { ResetPassword } from './reset_password.entity';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword) private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { super(); }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    if (payload.password !== payload.konfirmasiPassword) {
      throw new HttpException("Password & Konfirmasi Password Harus Sama", HttpStatus.BAD_REQUEST);
    }

    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException("Data Sudah Ada", HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save(payload);

    return this._success("Register Berhasil");
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email
      }, select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true
      }
    })

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(payload.password, checkUserExists.password)

    if (checkPassword) {
      const jwtPL: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email
      }

      const access_token = await this.generateJwt(jwtPL, '1d', jwt_config.access_token_secret)
      const refresh_token = await this.generateJwt(jwtPL, '7d', jwt_config.access_token_secret)
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      })

      return this._success("Login Success", {
        ...checkUserExists, access_token: access_token,
        refresh_token: refresh_token,
      })
    } else {
      throw new HttpException(
        'Login Gagal',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  generateJwt(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn
    })
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex');
    const link = `${process.env.BASE_CLIENT_URL}/auth/reset-password/${user.id}/${token}`;
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload);

    return this._success('Silahkan Cek Email');
  }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    payload.new_password = await hash(payload.new_password, 12);
    await this.authRepository.save({
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
