import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { Wisata } from '../wisata/wisata.entity';
import { CreateBookingDto, findAllBooking } from './booking.dto';
import { Booking } from './booking.entity';

@Injectable()
export class BookingService extends BaseResponse {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @InjectRepository(Wisata)
        private readonly wisataRepository: Repository<Wisata>,
        @Inject(REQUEST) private req: any,
    ) {
        super();
    }

    async create(payload: CreateBookingDto): Promise<ResponseSuccess> {
        try {
            const id: number = payload.id_wisata.id;
            const total = await this.wisataRepository.findOne({
                where: {
                    id
                }
            });

            payload.total_booking = payload.qty_booking * total.harga_wisata;
            payload.id_user = this.req.user.id;
            await this.bookingRepository.save(payload);

            return this._success('Berhasil Menyimpan Data');
        } catch {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async findAll(query: findAllBooking): Promise<ResponseSuccess> {

        const result = await this.bookingRepository.find({});
        return this._success('OK', result);
    }
}
