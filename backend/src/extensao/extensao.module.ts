import { Module } from '@nestjs/common';
import { ExtensaoController } from './extensao.controller';
import { ExtensaoService } from './extensao.service';

@Module({
  imports: [],
  providers: [ExtensaoService],
  controllers: [ExtensaoController],
})
export class ExtensaoModule {}
