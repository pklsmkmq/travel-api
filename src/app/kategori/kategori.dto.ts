import { OmitType } from "@nestjs/mapped-types";
import { IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class KategoriDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsString()
    nama_kategori: string;

    gambar_kategori: any;

    @IsObject()
    @IsOptional()
    created_by: { id: number };

    @IsObject()
    @IsOptional()
    updated_by: { id: number };
}

export class CreateKategoriDto extends OmitType(KategoriDto, ['id', 'updated_by']) { }
export class UpdateKategoriDto extends KategoriDto { }
export class findAllKategori extends PageRequestDto {
    @IsString()
    @IsOptional()
    nama_kategori: string;
    gambar_kategori: string;
}