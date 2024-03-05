import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { networkInterfaces } from 'os';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { CreatePaymentDto, findAllPayment } from './payment.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService extends BaseResponse {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @Inject(REQUEST) private req: any,
    ) {
        super();
    }

    async create(payload: CreatePaymentDto, file: Express.Multer.File): Promise<ResponseSuccess> {
        try {
            payload.gambar_payment = file.filename;
            await this.paymentRepository.save(payload);

            return this._success('OK', this.req.user.user_id);
        } catch {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllPayment(query: findAllPayment): Promise<ResponsePagination> {
        const { page, pageSize, limit } = query;

        const filterQuery: any = {}
        const result = await this.paymentRepository.find();

        const nets = networkInterfaces();
        const res = Object.create(null);
        let ip = "";

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
                if (net.family === familyV4Value && !net.internal) {
                    if (!res[name]) {
                        res[name] = [];
                    }
                    res[name].push(net.address);
                    console.log('ip', net.address);
                    ip = net.address;
                }
            }
        }

        for (let i in result) {
            result[i].gambar_payment = `http://${ip}:457/uploads/payment/${result[i].gambar_payment}`;
            console.log('gambar', result[i].gambar_payment);
        }

        const total = await this.paymentRepository.count();

        return this._pagination("ok", result, total, page, pageSize);
    }
}
