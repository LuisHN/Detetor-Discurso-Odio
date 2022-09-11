import { Module } from '@nestjs/common';
import { MysqlModule } from 'nest-mysql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassificadorController } from './classificador/classificador.controller';
import { ClassificadorService } from './classificador/classificador.service';
import { ClassificadorModule } from './classificador/classificador.module';
import { ExtensaoService } from './extensao/extensao.service';
import { ExtensaoModule } from './extensao/extensao.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MysqlModule.forRoot({
      host: 'localhost',
      port: 3306,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    }),
    ClassificadorModule,
    ExtensaoModule,
  ],
  controllers: [AppController, ClassificadorController],
  providers: [AppService, ClassificadorService, ExtensaoService],
})
export class AppModule {}
