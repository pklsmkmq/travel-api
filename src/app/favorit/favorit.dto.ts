import { OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class FavoritDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsObject()
    @IsOptional()
    id_user: { id: number };

    @IsObject()
    @IsOptional()
    id_wisata: { id: number };

    @IsObject()
    @IsOptional()
    created_by: { id: number };

    @IsObject()
    @IsOptional()
    updated_by: { id: number };
}

export class CreateFavoritDto extends OmitType(FavoritDto, ['id', 'updated_by']) { }
export class UpdateFavoritDto extends FavoritDto { }
export class findAllFavorit extends PageRequestDto {
    @IsInt()
    @IsOptional()
    id_user: number

    @IsString()
    @IsOptional()
    nama_wisata: string;

    @IsOptional()
    gambar_wisata: string;

    @IsString()
    @IsOptional()
    lokasi_wisata: string;

    @IsNumber()
    @IsOptional()
    rating_wisata: number;

    @IsNumber()
    @IsOptional()
    kategori: number;

    @IsString()
    @IsOptional()
    deskripsi_wisata: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    dari_harga: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    sampai_harga: number;

    @IsString()
    @IsOptional()
    keyword: string;
}