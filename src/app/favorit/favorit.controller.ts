import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateFavoritDto, findAllFavorit } from './favorit.dto';
import { FavoritService } from './favorit.service';

@UseGuards(JwtGuard)
@Controller('favorit')
export class FavoritController {
    constructor(private favoritService: FavoritService) { }

    @Get('/create/:id')
    async create(@Param('id') id: string, @InjectCreatedBy() payload: CreateFavoritDto) {
        return this.favoritService.create(+id, payload)
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        return this.favoritService.delete(+id)
    }

    @Get('list')
    async getAll(@Pagination() query: findAllFavorit) {
        return this.favoritService.findAll(query)
    }
}
