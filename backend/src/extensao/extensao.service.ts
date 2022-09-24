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
import { rejects } from 'assert';
const redis = require('redis');
const publisher = redis.createClient();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lngDetector = new (require('languagedetect'))();

@Injectable()
export class ExtensaoService {
  constructor(@InjectClient() private readonly connection: Connection) {
    this.init();
  }

  async init() {
    try {
      await publisher.connect();
    } catch (err) {}
  }

  private validateLanguage(string: string) {
    const prev = lngDetector.detect(string, 4);

    return prev.some((itm: any) => itm[0] == 'portuguese');
  }

  async addStrings(createExtensaoDTO: CreateExtensaoDTO) {
    return new Promise(async (resolve) => {
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
        const result = await this.connection.query(
          'select id from  database_ORIG where string in (?) and clientHash = ?',
          [strings, hash],
        );

        result[0].forEach(async (item: any) => {
          await publisher.publish('channel-classificador', String(item.id));
        });

        resolve(true);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    });
  }

  getHash() {
    return uuidv4();
  }

  async StringsByHash(hash: string) {
    const classString = await this.connection.query(
      'SELECT id, string, classification FROM strings WHERE clientHash = ? and deleted = 0 ;',
      [hash],
    );

    if (!classString) {
      throw new NotFoundException();
    }

    return classString[0];
  }
}
