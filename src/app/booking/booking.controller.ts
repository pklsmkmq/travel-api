import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateBookingDto, findAllBooking } from './booking.dto';
import { BookingService } from './booking.service';

@UseGuards(JwtGuard)
@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingService) { }

    @Post('create')
    async create(@InjectCreatedBy() payload: CreateBookingDto) {
        return this.bookingService.create(payload);
    }

    @Get('list')
    async getAllBooking(@Pagination() query: findAllBooking) {
        return this.bookingService.findAll(query)
    }
}
