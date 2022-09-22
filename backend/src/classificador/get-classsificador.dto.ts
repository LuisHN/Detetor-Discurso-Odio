import { IsString } from 'class-validator';

export class GetClassificadorDTO {
  @IsString()
  string: string;
}
