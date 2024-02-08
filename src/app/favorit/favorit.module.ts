import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritController } from './favorit.controller';
import { Favorit } from './favorit.entity';
import { FavoritService } from './favorit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorit])],
  controllers: [FavoritController],
  providers: [FavoritService]
})
export class FavoritModule { }
