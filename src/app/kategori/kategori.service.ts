import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { networkInterfaces } from 'os';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Like, Repository } from 'typeorm';
import { CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { Kategori } from './kategori.entity';

@Injectable()
export class KategoriService extends BaseResponse {
    constructor(
        @InjectRepository(Kategori)
        private readonly kategoriRepository: Repository<Kategori>,
        @Inject(REQUEST) private req: any,
    ) {
        super();
    }

    async create(payload: CreateKategoriDto, file: Express.Multer.File): Promise<ResponseSuccess> {
        try {
            payload.gambar_kategori = file.filename;
            await this.kategoriRepository.save(payload);

            return this._success('OK', this.req.user.user_id);
        } catch {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
        const { page, pageSize, limit, nama_kategori } = query;

        const filterQuery: any = {}
        if (nama_kategori) {
            filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
        }
        const total = await this.kategoriRepository.count({
            where: filterQuery,
        });
        const result = await this.kategoriRepository.find({
            where: filterQuery,
            relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
            select: {   // pilih data mana saja yang akan ditampilkan dari tabel kategori
                id: true,
                nama_kategori: true,
                gambar_kategori: true,
                created_by: {
                    id: true,   // pilih field  yang akan ditampilkan dari tabel user
                    nama: true,
                },
                updated_by: {
                    id: true, // pilih field yang akan ditampilkan dari tabel user
                    nama: true,
                },
            },
            skip: limit,
            take: pageSize,
        });

        return this._pagination("ok", result, total, page, pageSize);
    }

    async detailCategory(id: number): Promise<ResponseSuccess> {
        try {
            const result = await this.kategoriRepository.findOne({
                where: {
                    id,
                }
            });
            if (!result)
                throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);

            return this._success('OK', result);
        } catch (error) {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async update(id: number, payload: UpdateKategoriDto): Promise<ResponseSuccess> {
        console.log(id)
        const check = await this.kategoriRepository.findOne({
            where: {
                id,
            }
        });
        if (!check)
            throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
        
        await this.kategoriRepository.save({
            ...payload,
            id: id,
        });
        return this._success('Kategori berhasil diperbaharui');
    }

    async delete(id: number): Promise<ResponseSuccess> {
        const check = await this.kategoriRepository.findOne({
            where: {
                id,
            }
        });
        if (!check)
            throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);

        await this.kategoriRepository.delete(id);

        return this._success('Kategori berhasil dihapus');
    }
}
