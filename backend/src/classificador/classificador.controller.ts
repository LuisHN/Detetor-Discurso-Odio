import { Body, Controller, Delete, Get, HttpCode, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassificadorService } from './classificador.service';
import { CreateClassificadorDTO } from './create-classsificador.dto';
import { DeleteClassificadorDTO } from './delete-classsificador.dto';
import { GetClassificadorDTO } from './get-classsificador.dto';

@ApiTags('classificador')
@Controller('classificador')
export class ClassificadorController {
  constructor(private readonly classificadorService: ClassificadorService) {}

  @Get()
  @ApiOperation({ summary: 'Devolve um item para classificação manual.' })
  @ApiResponse({
    status: 200,
  })
  getString(): any {
    return this.classificadorService.getOneString();
  }

  @Put()
  @ApiOperation({ summary: 'Insere uma classificação num determinado item.' })
  @HttpCode(204)
  setClassification(@Body() createClassificadorDTO: CreateClassificadorDTO) {
    return this.classificadorService.setClassification(createClassificadorDTO);
  }

  @Delete()
  @ApiOperation({
    summary: 'Inserir uma intenção de eliminar um determinado item.',
  })
  @ApiResponse({ status: 204, description: 'Deleted.' })
  @HttpCode(204)
  deleteString(@Body() deleteClassificadorDTO: DeleteClassificadorDTO) {
    return this.classificadorService.deleteString(deleteClassificadorDTO);
  }

  @Post()
  @ApiOperation({ summary: 'Insere um item para ser classificado.' })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um identificador para consultar a classificação caso esta demore mais de 30 segundos.',
  })
  @HttpCode(204)
  getClassification(@Body() getClassificadorDTO: GetClassificadorDTO) {
    return this.classificadorService.getClassification(getClassificadorDTO);
  }
}
