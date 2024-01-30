import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuard } from 'src/auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { KategoriService } from './kategori.service';

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
    constructor(private kategoriService: KategoriService) { }

    @UseInterceptors(
        FileInterceptor('gambar_kategori', {
            storage: diskStorage({
                destination: 'public/uploads/kategori',
                filename: (req, file, cb) => {
                    const fileExtension = file.originalname.split('.').pop();
                    cb(null, `${new Date().getTime()}.${fileExtension}`);
                },
            }),
        }),
    )
    @Post('create')
    async create(@InjectCreatedBy() payload: CreateKategoriDto, @UploadedFile() file: Express.Multer.File) { //ganti @Body() dengan @InjectCreatedBy()
        return this.kategoriService.create(payload, file);
    }

    @Get('list')
    async getAllCategory(@Pagination() query: findAllKategori) {  //gunakan custom decorator yang pernah kita buat
        return this.kategoriService.getAllCategory(query)
    }

    @Get('/detail/:id')
    async detail(@Param('id') id: string) {
        return this.kategoriService.detailCategory(+id)
    }

    @Put('/update/:id')
    async update(
        @InjectUpdatedBy() payload: UpdateKategoriDto,
        @Param('id') id: number,
    ) {
        console.log('payload disini', payload);
        return this.kategoriService.update(id, payload);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        return this.kategoriService.delete(+id)
    }
}
