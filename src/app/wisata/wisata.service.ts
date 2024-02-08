import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Between, Like, Repository } from 'typeorm';
import { Favorit } from '../favorit/favorit.entity';
import { CreateWisataDto, findAllWisata, UpdateWisataDto } from './wisata.dto';
import { Wisata } from './wisata.entity';

@Injectable()
export class WisataService extends BaseResponse {

    constructor(
        @InjectRepository(Wisata)
        private readonly wisataRepository: Repository<Wisata>,
        @InjectRepository(Favorit)
        private readonly favoritRepo: Repository<Favorit>,
        @Inject(REQUEST) private req: any,

    ) {
        super();
    }

    async create(payload: CreateWisataDto, file: Express.Multer.File): Promise<ResponseSuccess> {
        try {
            payload.gambar_wisata = file.filename;
            const dataSave = {
                ...payload,

                kategori_id: {
                    id: payload.kategori_id
                }
            }
            await this.wisataRepository.save(dataSave);

            return this._success('Berhasil Menyimpan Data');
        } catch {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async findAll(query: findAllWisata): Promise<ResponsePagination> {
        const {
            page,
            pageSize,
            limit,
            nama_wisata,
            dari_harga,
            sampai_harga,
            deskripsi_wisata,
            lokasi_wisata,
            rating_wisata,
            kategori
        } = query;

        const filterQuery: any = {};
        if (deskripsi_wisata) {
            filterQuery.deskripsi_wisata = Like(`%${deskripsi_wisata}%`);
        }
        if (nama_wisata) {
            filterQuery.nama_wisata = Like(`%${nama_wisata}%`);
        }
        if (lokasi_wisata) {
            filterQuery.lokasi_wisata = Like(`%${lokasi_wisata}%`)
        }
        if (dari_harga && sampai_harga) {
            filterQuery.harga_wisata = Between(dari_harga, sampai_harga);
        }
        if (dari_harga && !!sampai_harga === false) {
            filterQuery.harga_wisata = Between(dari_harga, dari_harga);
        }
        if (rating_wisata) {
            filterQuery.rating_wisata = rating_wisata;
        }
        if (kategori) {
            filterQuery.kategori_id = Between(kategori, kategori);
        }
        const total = await this.wisataRepository.count({
            where: filterQuery,
        });

        const result = await this.wisataRepository.find({
            where: filterQuery,
            relations: ['created_by', 'updated_by', 'kategori_id'],
            select: {
                id: true,
                nama_wisata: true,
                deskripsi_wisata: true,
                rating_wisata: true,
                harga_wisata: true,
                lokasi_wisata: true,
                kategori_id: {
                    id: true,
                    nama_kategori: true,
                },
                created_by: {
                    id: true,
                    nama: true,
                },
                updated_by: {
                    id: true,
                    nama: true,
                },
            },
            skip: limit,
            take: pageSize,
        });
        
        return this._pagination('OK', result, total, page, pageSize);
    }

    async update(id: number, payload: UpdateWisataDto): Promise<ResponseSuccess> {
        console.log(id)
        const check = await this.wisataRepository.findOne({
            where: {
                id,
            }
        });
        if (!check)
            throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);

        await this.wisataRepository.save({
            ...payload,
            id: id,
            kategori_id: {
                id: payload.kategori_id
            }
        });
        return this._success('Kategori berhasil diperbaharui');
    }

    async delete(id: number): Promise<ResponseSuccess> {
        const check = await this.wisataRepository.findOne({
            where: {
                id,
            }
        });
        if (!check)
            throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);

        await this.wisataRepository.delete(id);

        return this._success('Kategori berhasil dihapus');
    }
}
