import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuard } from 'src/auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreatePaymentDto, findAllPayment } from './payment.dto';
import { PaymentService } from './payment.service';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @UseInterceptors(
        FileInterceptor('gambar_payment', {
            storage: diskStorage({
                destination: 'public/uploads/payment',
                filename: (req, file, cb) => {
                    const fileExtension = file.originalname.split('.').pop();
                    cb(null, `${new Date().getTime()}.${fileExtension}`);
                },
            }),
        }),
    )
    @Post('create')
    async create(@InjectCreatedBy() payload: CreatePaymentDto, @UploadedFile() file: Express.Multer.File) { //ganti @Body() dengan @InjectCreatedBy()
        return this.paymentService.create(payload, file);
    }

    @Get('list')
    async getAllPayment(@Pagination() query: findAllPayment) {  //gunakan custom decorator yang pernah kita buat
        return this.paymentService.getAllPayment(query)
    }
}
