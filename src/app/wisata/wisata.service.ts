import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { Between, Like, Repository } from 'typeorm';
import { Favorit } from '../favorit/favorit.entity';
import { CreateWisataDto, findAllWisata, UpdateWisataDto } from './wisata.dto';
import { Wisata } from './wisata.entity';
import { networkInterfaces } from 'os';

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

    async findAll(query: findAllWisata): Promise<ResponseSuccess> {
        const {
            nama_wisata,
            dari_harga,
            sampai_harga,
            deskripsi_wisata,
            lokasi_wisata,
            rating_wisata,
            kategori, favorit
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
            relations: ['kategori_id'],
            select: {
                id: true,
                nama_wisata: true,
                deskripsi_wisata: true,
                rating_wisata: true,
                harga_wisata: true,
                lokasi_wisata: true,
                gambar_wisata: true,
                kategori_id: {
                    id: true,
                    nama_kategori: true,
                },
            },
        });

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
            result[i].gambar_wisata = `http://${ip}:457/uploads/wisata/${result[i].gambar_wisata}`;
            console.log('gambar', result[i].gambar_wisata);
        }

        const b: any = result;
        const fq: any = {};

        fq.id_user = Between(this.req.user.id, this.req.user.id);

        const fav = await this.favoritRepo.find({
            where: fq,
            relations: ['id_wisata', 'id_user'],
            select: {
                id: true,
                id_wisata: {
                    id: true
                },
                id_user: {
                    id: true
                },
            }
        });

        console.log("fav", fav);

        let cek = "";
        let data = [];

        for (let i in b) {
            cek = "";
            for (let n in fav) {
                if (b[i].id == fav[n].id_wisata.id) {
                    b[i].favorit = true;
                    cek = "ada";
                    data.push(b[i]);
                    break;
                }
            }
            if (cek == "") {
                b[i].favorit = false;
            }
        }

        return this._success('OK', favorit ? data : b);
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