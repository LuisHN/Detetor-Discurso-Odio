import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateExtensaoDTO {
  @ApiProperty({
    example: '["O sol quando nasce é para todos", "Devias morrer"]',
  })
  @IsArray()
  @ArrayMinSize(1)
  strings: string[];

  @ApiProperty({
    description:
      'Identificador de sessão, utilizado para listar todas as frases geradas.',
    example: '5833a8c0-99a2-4962-831d-e038aa8476f3',
  })
  @IsString()
  hash: string;
}
