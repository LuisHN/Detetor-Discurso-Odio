import { Module } from '@nestjs/common';
import { ExtensaoService } from 'src/extensao/extensao.service';
import { ClassificadorController } from './classificador.controller';
import { ClassificadorService } from './classificador.service';

@Module({
  imports: [],
  providers: [ClassificadorService, ExtensaoService],
  controllers: [ClassificadorController],
})
export class ClassificadorModule {}
