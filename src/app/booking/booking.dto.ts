import { OmitType } from "@nestjs/mapped-types";
import { IsBoolean, IsDate, IsInt, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class BookingDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsDate()
    date_booking: Date;

    @IsOptional()
    id_user: { id: number };

    @IsNumber()
    @IsOptional()
    id_wisata: { id: number };

    @IsOptional()
    @IsString()
    name_booking: string;

    @IsOptional()
    @IsString()
    contact_booking: string;

    @IsOptional()
    @IsInt()
    qty_booking: number;

    @IsOptional()
    total_booking: number;

    @IsOptional()
    @IsBoolean()
    status_booking: boolean;

    @IsNumber()
    @IsOptional()
    id_payment: { id: number };

    @IsObject()
    @IsOptional()
    created_by: { id: number };

    @IsObject()
    @IsOptional()
    updated_by: { id: number };
}

export class CreateBookingDto extends OmitType(BookingDto, ['id', 'updated_by']) { }
export class findAllBooking extends PageRequestDto {
    @IsOptional()
    date_booking: Date;
    status_booking: boolean;
}