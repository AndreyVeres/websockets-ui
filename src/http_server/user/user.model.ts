import { v4 as uuid } from 'uuid';
import { WebSocket } from 'ws';
import { Model } from '../abstract/model';

export interface UserDto {
  name: string;
  password: string;
  ws: WebSocket;
}

export class User implements Model {
  name: string;
  password: string;
  $ws: WebSocket;
  id: string;
  wins: number = 0;
  $isBot = false;

  constructor(dto: UserDto) {
    this.name = dto.name;
    this.password = dto.password;
    this.$ws = dto.ws;
    this.id = uuid();
  }

  addWin() {
    this.wins += 1;
  }

  updateSocket(ws: WebSocket) {
    this.$ws = ws;
  }

  get data() {
    return {
      name: this.name,
      index: this.id,
      error: false,
      errorText: '',
    };
  }
}
