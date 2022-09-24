import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExtensaoDTO } from './create-extensao.dto';
import { ExtensaoService } from './extensao.service';
@ApiTags('extensao')
@Controller('extensao')
export class ExtensaoController {
  constructor(private extensaoService: ExtensaoService) {}

  @Post()
  @ApiOperation({ summary: 'Insere items para classificação.' })
  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  addStrings(@Body() createExtensaoDTO: CreateExtensaoDTO) {
    return this.extensaoService.addStrings(createExtensaoDTO);
  }

  @Get('hash')
  @ApiOperation({ summary: 'Devolve Hash para a sessão.' })
  @ApiResponse({
    status: 200,
  })
  getHash() {
    return this.extensaoService.getHash();
  }

  @Get(':hash')
  @ApiOperation({ summary: 'Devolve items criados por determinado Hash.' })
  @ApiParam({
    name: 'hash',
    required: true,
  })
  @ApiResponse({
    status: 200
  })
  StringsByHash(@Param('hash') hash) {
    return this.extensaoService.StringsByHash(hash);
  }
}
