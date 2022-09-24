import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsNumber,
} from 'class-validator';

export class CreateClassificadorDTO {
  @ApiProperty({
    description:
      'Corresponde à classificação da frase, sendo 1 discurso de ódio e 0 discurso normal',
    example: '1',
  })
  @IsNumberString()
  classification: number;

  @ApiProperty({
    description: 'Identificador da frase.',
    example: '1',
  })
  @IsNumberString()
  id: number;

  @ApiProperty({
    description: 'Define se a classificação esta a ser efetuada pela criado.',
    example: '1',
  })
  @IsNumber()
  isOwner: number;
}
