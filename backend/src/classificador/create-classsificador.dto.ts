import { IsEmail, IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateClassificadorDTO {
  @IsNumberString()
  classification: number;

  @IsNumberString()
  id: number;
}
