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
import { DeleteClassificadorDTO } from './delete-classsificador.dto';
import { query } from 'express';
import { GetClassificadorDTO } from './get-classsificador.dto';

@Injectable()
export class ClassificadorService {
  constructor(@InjectClient() private readonly connection: Connection) {}
  async getOneString() {
    const classString = await this.connection.query(
      'SELECT * FROM classification WHERE needClassification = 1 and deleted < 2 limit 1;',
    );

    if (!classString) {
      throw new NotFoundException();
    }
    const { id, string } = classString[0][0];

    const result = { id, string };

    return result;
  }

  async getOneStringByID(id: number) {
    const classString = await this.connection.query(
      'SELECT * FROM classification WHERE id = ? limit 1',
      [id],
    );

    if (!classString) {
      throw new NotFoundException();
    }
    return classString[0];
  }

  async getClassification(getClassificadorDTO: GetClassificadorDTO) {
    //insert into job queue urgents
  }

  async setClassification(createClassificadorDTO: CreateClassificadorDTO) {
    try {
      const { classification, id } = createClassificadorDTO;
      const st = await this.getOneStringByID(id);
      let query = undefined;
      if (st.length == 1) {
        for (let i = 1; i < 5; i++) {
          if (st[0][`classification_${i}`] == null) {
            query = `UPDATE classification SET classification_${i}=? ${
              i == 4 ? ',needClassification = 0' : ''
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

  async deleteString(deleteClassificadorDTO: DeleteClassificadorDTO) {
    try {
      const { id } = deleteClassificadorDTO;

      await this.connection.query(
        'UPDATE classification SET deleted= deleted + 1 WHERE id=?',
        [id],
      );
      return '';
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
