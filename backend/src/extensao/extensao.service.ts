import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectClient } from 'nest-mysql';
import { Connection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { CreateExtensaoDTO } from './create-extensao.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lngDetector = new (require('languagedetect'))();

@Injectable()
export class ExtensaoService {
  constructor(@InjectClient() private readonly connection: Connection) {}

  private validateLanguage(string: string) {
    const prev = lngDetector.detect(string, 4);

    return prev.some((itm: any) => itm[0] == 'portuguese');
  }

  async addStrings(createExtensaoDTO: CreateExtensaoDTO) {
    try {
      const { strings, hash } = createExtensaoDTO;

      strings.forEach(async (st: string) => {
        if (this.validateLanguage(st)) {
          try {
            await this.connection.query(
              'insert IGNORE into database_ORIG (string, clientHash) values (?,?)',
              [st, hash],
            );
          } catch (err) {}
        }
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  getHash() {
    return uuidv4();
  }

  async StringsByHash(hash: string) {
    const classString = await this.connection.query(
      'SELECT * FROM strings WHERE clientHash = ? and deleted = 0 ;',
      [hash],
    );

    if (!classString) {
      throw new NotFoundException();
    }
    const result = classString[0].map(
      ({ clientHash, deleted, created_at, updated_at, ...keepAttr }) =>
        keepAttr,
    );

    return result;
  }
}
