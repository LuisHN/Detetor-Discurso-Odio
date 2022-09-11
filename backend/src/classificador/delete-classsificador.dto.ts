import { IsEmail, IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class DeleteClassificadorDTO {
  @IsNumberString()
  id: number;
}
