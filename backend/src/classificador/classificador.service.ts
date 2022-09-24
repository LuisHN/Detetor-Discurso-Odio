import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectClient } from 'nest-mysql';
import { Connection } from 'mysql2';
import { CreateClassificadorDTO } from './create-classsificador.dto'; 
import { GetClassificadorDTO } from './get-classsificador.dto';
import { ExtensaoService } from 'src/extensao/extensao.service';

@Injectable()
export class ClassificadorService {
  delay = (ms) => new Promise((res) => setTimeout(res, ms));
  constructor(
    @InjectClient() private readonly connection: Connection,
    private extensaoService: ExtensaoService,
  ) {}

  async getOneString() {
    const classString = await this.connection.query(
      'SELECT * FROM strings WHERE needClassification = 1 and sortedByOwner = 1 and deleted < 2 limit 1;',
    );

    if (!classString || classString[0].length == 0) {
      throw new NotFoundException();
    }
    const { id, string } = classString[0][0];

    const result = { id, string };

    return result;
  }

  async getOneStringByID(id: number) {
    const classString = await this.connection.query(
      'SELECT * FROM strings WHERE id = ? and deleted < 3 limit 1',
      [id],
    );

    if (!classString) {
      throw new NotFoundException();
    }
    return classString[0];
  }

  async getClassification(getClassificadorDTO: GetClassificadorDTO) {
    const hash = this.extensaoService.getHash();

    this.extensaoService
      .addStrings({
        strings: [getClassificadorDTO.string],
        hash,
      })
      .then()
      .catch();

    let classification = undefined;

    await this.delay(5000);

    try {
      classification = await this.extensaoService.StringsByHash(hash);
    } catch (e) {
      return {
        hash,
      };
    }

    return {
      hash,
      classification,
    };
  }

  async setClassification(createClassificadorDTO: CreateClassificadorDTO) {
    try {
      const { classification, id } = createClassificadorDTO;
      const st = await this.getOneStringByID(id);
      let query = undefined;
      if (st.length == 1) {
        for (let i = 1; i < 5; i++) {
          if (st[0][`classification_${i}`] == null) {
            query = `UPDATE strings SET classification_${i}=? ${
              i == 4 ? ',needClassification = 0' : ''
            } ${
              createClassificadorDTO.isOwner ? 'sortedByOwner = 1' : ''
            } WHERE id=?`;
            break;
          }
        }

        if (!query) {
          throw new NotFoundException();
        }
      } else {
        throw new NotFoundException();
      }

      await this.connection.query(query, [classification, id]);
      return '';
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteString(id: any, isOwner: any) {
    try {
      let deleted = 1;
      if (isOwner == '1') {
        deleted = 4;
      }

      await this.connection.query(
        'UPDATE strings SET deleted= deleted + ? WHERE id=?',
        [deleted, id],
      );
      return '';
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
