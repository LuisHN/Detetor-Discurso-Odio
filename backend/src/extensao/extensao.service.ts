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
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    const prev = lngDetector.detect(string, 3);

    return prev.some((itm: any) => itm[0] == 'portuguese');
  }

  private isValidString(string: string) {
    const badWords = [
      'Conteúdo partilhado com',
      'amigos em comum',
      'Ver mais',
      'respostas anteriores',
      'Ver comentários anteriores',
      'Vídeos do Reels',
      'outras pessoas',
      'comentou.',
    ];

    return !badWords.some((substring) => string.includes(substring));
  }

  private cleanString(string: string) {
    //remove email
    string = string.replace(
      /([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/,
      '',
    );
    //remove emojis
    string = string.replaceAll(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    //remove nbsp
    string = string.replaceAll(/\&nbsp;/g, '');

    return string;
  }

  async addStrings(
    createExtensaoDTO: CreateExtensaoDTO,
    _isClassificador = false,
  ) {
    try {
      this.connection.connect();
    } catch (e) {}

    return new Promise(async (resolve) => {
      try {
        const { strings, hash } = createExtensaoDTO;

        strings.forEach(async (st: string) => {
          if ((this.validateLanguage(st), this.isValidString(st))) {
            const newString = this.cleanString(st);
            try {
              await this.connection.query(
                'insert IGNORE into database_ORIG (string, clientHash) values (?,?)',
                [newString, hash],
              );
            } catch (err) {}
          }
        });
        const result = await this.connection.query(
          'select id from  database_ORIG where string in (?) and clientHash = ?',
          [strings, hash],
        );

        const channel = _isClassificador
          ? 'channel-classificador'
          : 'channel-extensao';

        result[0].forEach(async (item: any) => {
          await publisher.publish(channel, String(item.id));
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

  async StringsByHash(hash: string, _isClassificador = false) {
    try {
      this.connection.connect();
    } catch (e) {}
    const classString = await this.connection.query(
      'SELECT id, string, classification, sortedByOwner as classifiedO FROM strings WHERE clientHash = ? and deleted = 0 and sortedByOwner = 0;',
      [hash],
    );

    if (!classString) {
      throw new NotFoundException();
    }

    return classString[0];
  }
}
