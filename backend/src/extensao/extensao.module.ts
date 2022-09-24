import { Module } from '@nestjs/common';
import { ExtensaoController } from './extensao.controller';
import { ExtensaoService } from './extensao.service';

@Module({
  imports: [],
  exports: [ExtensaoService],
  providers: [ExtensaoService],
  controllers: [ExtensaoController],
})
export class ExtensaoModule {}
