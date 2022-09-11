import { Module } from '@nestjs/common';
import { ClassificadorController } from './classificador.controller';
import { ClassificadorService } from './classificador.service';

@Module({
  imports: [],
  providers: [ClassificadorService],
  controllers: [ClassificadorController],
})
export class ClassificadorModule {}
