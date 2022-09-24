import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetClassificadorDTO {
  @ApiProperty({ 
    example: 'O sol quando nasce é para todos.',
  })
  @IsString()
  string: string;
}
