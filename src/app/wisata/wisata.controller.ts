import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuard } from 'src/auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateWisataDto, findAllWisata, UpdateWisataDto } from './wisata.dto';
import { WisataService } from './wisata.service';

@UseGuards(JwtGuard)
@Controller('wisata')
export class WisataController {
    constructor(private wisataService: WisataService) { }

    @UseInterceptors(
        FileInterceptor('gambar_wisata', {
            storage: diskStorage({
                destination: 'public/uploads/wisata',
                filename: (req, file, cb) => {
                    const fileExtension = file.originalname.split('.').pop();
                    cb(null, `${new Date().getTime()}.${fileExtension}`);
                },
            }),
        }),
    )
    @Post('create')
    async create(@InjectCreatedBy() payload: CreateWisataDto, @UploadedFile() file: Express.Multer.File) {
        return this.wisataService.create(payload, file);
    }

    @Get('list')
    async getAllWisata(@Pagination() query: findAllWisata) {
        return this.wisataService.findAll(query)
    }

    @Put('/update/:id')
    async update(
        @InjectUpdatedBy() payload: UpdateWisataDto,
        @Param('id') id: number,
    ) {
        console.log('payload disini', payload);
        return this.wisataService.update(id, payload);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        return this.wisataService.delete(+id)
    }
}
