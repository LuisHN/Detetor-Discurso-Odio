import { Body, Controller, Delete, Get, HttpCode, Put } from '@nestjs/common';
import { ClassificadorService } from './classificador.service';
import { CreateClassificadorDTO } from './create-classsificador.dto';
import { DeleteClassificadorDTO } from './delete-classsificador.dto';

@Controller('classificador')
export class ClassificadorController {
  constructor(private readonly classificadorService: ClassificadorService) {}

  @Get()
  getString(): any {
    return this.classificadorService.getOneString();
  }

  @Put()
  @HttpCode(204)
  setClassification(@Body() createClassificadorDTO: CreateClassificadorDTO) {
    return this.classificadorService.setClassification(createClassificadorDTO);
  }

  @Delete()
  @HttpCode(204)
  deleteString(@Body() deleteClassificadorDTO: DeleteClassificadorDTO) {
    return this.classificadorService.deleteString(deleteClassificadorDTO);
  }
}
