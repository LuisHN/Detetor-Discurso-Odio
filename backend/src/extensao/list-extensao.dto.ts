import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class ListExtensaoDTO {
  @IsArray()
  @ArrayMinSize(1)
  string: string[];

  @IsString()
  hash: string;
}
