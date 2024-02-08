import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorit } from '../favorit/favorit.entity';
import { WisataController } from './wisata.controller';
import { Wisata } from './wisata.entity';
import { WisataService } from './wisata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wisata, Favorit])],
  controllers: [WisataController],
  providers: [WisataService]
})
export class WisataModule { }
