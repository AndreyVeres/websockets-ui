import { Game } from './game/game.model';
import { Room } from './room/room.model';
import { User } from './user/user.model';

export class Database {
  users: User[] = [];
  rooms: Room[] = [];
  games: Game[] = [];
}
