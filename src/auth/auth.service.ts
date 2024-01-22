import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { jwt_config } from 'src/config/jwt.config';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { User } from './auth.entity';

@Injectable()
export class AuthService extends BaseResponse {
    constructor(
        @InjectRepository(User) private readonly authRepository: Repository<User>,
        private jwtService: JwtService,
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
}
