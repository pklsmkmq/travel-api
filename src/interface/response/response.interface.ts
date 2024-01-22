import { HttpStatus } from "@nestjs/common";

export interface ResponseSuccess {
    status: string;
    message: string;
    data?: any;
    statusCode?: HttpStatus;
    count?: number;
}

export interface ResponsePagination extends ResponseSuccess{
    pagination: {
        page: number;
        pageSize: number;
    }
}