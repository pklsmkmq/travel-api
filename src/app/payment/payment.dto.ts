import { OmitType } from "@nestjs/mapped-types";
import { IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class PaymentDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsString()
    name_payment: string;

    gambar_payment: any;

    @IsObject()
    @IsOptional()
    created_by: { id: number };

    @IsObject()
    @IsOptional()
    updated_by: { id: number };
}

export class CreatePaymentDto extends OmitType(PaymentDto, ['id']) { }
export class UpdatePaymentDto extends PaymentDto { }
export class findAllPayment extends PageRequestDto {
    @IsString()
    @IsOptional()
    name_payment: string;
    gambar_payment: string;
}