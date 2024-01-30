import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from "./config/typeorm.config";
import { KategoriModule } from './app/kategori/kategori.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
// import { WisataModule } from './app/wisata/wisata.module';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),

  ConfigModule.forRoot({
    isGlobal: true,
  }), TypeOrmModule.forRoot(typeOrmConfig), AuthModule, KategoriModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
