import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateExtensaoDTO {
  @IsArray()
  @ArrayMinSize(1)
  strings: string[];

  @IsString()
  hash: string;
}
