import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bem vindo à Plataforma de deteção automática de discurso de ódio em língua portuguesa!';
  }
}
