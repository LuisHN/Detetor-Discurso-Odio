import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateExtensaoDTO } from './create-extensao.dto';
import { ExtensaoService } from './extensao.service';

@Controller('extensao')
export class ExtensaoController {
  constructor(private extensaoService: ExtensaoService) {}

  @Post()
  @HttpCode(204)
  addStrings(@Body() createExtensaoDTO: CreateExtensaoDTO) {
    return this.extensaoService.addStrings(createExtensaoDTO);
  }

  @Get('hash')
  getHash() {
    return this.extensaoService.getHash();
  }

  @Get(':hash')
  StringsByHash(@Param('hash') hash) {
    return this.extensaoService.StringsByHash(hash);
  }
}
