import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/payment.entity';
import { Wisata } from '../wisata/wisata.entity';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Wisata])],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule { }
