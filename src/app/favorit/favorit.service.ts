import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { CreateFavoritDto, findAllFavorit, UpdateFavoritDto } from './favorit.dto';
import { Favorit } from './favorit.entity';

@Injectable()
export class FavoritService extends BaseResponse {
    constructor(
        @InjectRepository(Favorit)
        private readonly favoritRepo: Repository<Favorit>,
        @Inject(REQUEST) private req: any,
    ) {
        super()
    }

    async create(id: number, payload: CreateFavoritDto): Promise<ResponseSuccess> {
        try {
            const dataSave = {
                ...payload,

                id_wisata: {
                    id: id
                },

                id_user: {
                    id: payload.created_by.id
                }
            }
            await this.favoritRepo.save(dataSave);

            return this._success('Berhasil Menambahkan Wisata Favorit');
        } catch {
            throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async delete(id: number): Promise<ResponseSuccess> {
        const check = await this.favoritRepo.findOne({
            where: {
                id,
            }
        });
        if (!check)
            throw new NotFoundException(`Favorit dengan id ${id} tidak ditemukan`);

        await this.favoritRepo.delete(id);

        return this._success('Favorit berhasil dihapus');
    }

    async findAll(query: findAllFavorit): Promise<ResponsePagination> {
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
        const total = await this.favoritRepo.count({
            where: filterQuery,
        });

        const result = await this.favoritRepo.find({
            where: filterQuery,
            relations: ['created_by', 'updated_by', 'id_wisata', 'id_user'],
            select: {
                id: true,
                id_wisata: {
                    id: true,
                    nama_wisata: true,
                },
                id_user: {
                    id: true,
                    nama: true
                },
                created_by: {
                    id: true,
                    nama: true,
                },
            },
            skip: limit,
            take: pageSize,
        });
        return this._pagination('OK', result, total, page, pageSize);
    }
}
