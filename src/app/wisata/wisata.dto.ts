import { OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, isNumber, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class WisataDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    nama_wisata: string;

    gambar_wisata: any;

    @IsString()
    @IsNotEmpty()
    lokasi_wisata: string;

    @IsNumber()
    @IsNotEmpty()
    rating_wisata: number;

    @IsString()
    @IsNotEmpty()
    deskripsi_wisata: string;

    @IsNumber()
    @IsNotEmpty()
    harga_wisata: number;

    @IsNumber()
    @IsNotEmpty()
    kategori_id: number;

    @IsObject()
    @IsOptional()
    created_by: { id: number };

    @IsObject()
    @IsOptional()
    updated_by: { id: number };
}

export class CreateWisataDto extends OmitType(WisataDto, ['id']) { }
export class UpdateWisataDto extends WisataDto { }
export class findAllWisata extends PageRequestDto {
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

    @IsBoolean()
    @IsOptional()
    favorit: boolean;

    @IsString()
    @IsOptional()
    keyword: string;
}