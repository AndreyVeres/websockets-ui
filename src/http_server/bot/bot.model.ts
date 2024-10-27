import { MESSAGES_TYPE } from '../enum/enum';
import { Game } from '../game/game.model';
import { Room } from '../room/room.model';
import { User, UserDto } from '../user/user.model';
import { v4 as uuid } from 'uuid';

export class Bot extends User {
  private game: Game;

  constructor(dto: UserDto) {
    super(dto);
    this.name = uuid();
    this.$isBot = true;
  }

  get on() {
    return this.$ws.on.bind(this.$ws);
  }

  assignInRomm(room: Room) {
    this.$ws.send(
      JSON.stringify({
        type: MESSAGES_TYPE.ADD_USER_TO_ROOM,
        data: JSON.stringify({
          indexRoom: room.roomId,
        }),
      })
    );
  }

  addGame(game: Game) {
    this.game = game;
  }

  reg() {
    this.$ws.send(
      JSON.stringify({
        type: MESSAGES_TYPE.REG,
        data: JSON.stringify({
          name: 'bot-' + this.name.slice(0, 10),
          password: '123123',
        }),
      })
    );
  }

  attack(indexPlayer: string) {
    const { x, y } = this.game.getRandomAvailableCoordinates();

    this.$ws.send(
      JSON.stringify({
        type: 'attack',
        data: JSON.stringify({
          x: x || 0,
          y: y || 0,
          indexPlayer,
          gameId: this.game.idGame,
        }),
      })
    );
  }

  placeShips(idGame: string, idPlayer: string) {
    this.id = idPlayer;
    this.$ws.send(
      JSON.stringify({
        type: MESSAGES_TYPE.ADD_SHIPS,
        data: JSON.stringify({
          gameId: idGame,
          ships: mockShips,
          indexPlayer: idPlayer,
        }),
      })
    );
  }
}

const mockShips = [
  { position: { x: 9, y: 4 }, direction: true, type: 'huge', length: 4 },
  { position: { x: 8, y: 0 }, direction: true, type: 'large', length: 3 },
  { position: { x: 1, y: 1 }, direction: false, type: 'large', length: 3 },
  { position: { x: 5, y: 2 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 5, y: 7 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 3, y: 7 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 0, y: 9 }, direction: false, type: 'small', length: 1 },
  { position: { x: 5, y: 0 }, direction: true, type: 'small', length: 1 },
  { position: { x: 1, y: 4 }, direction: false, type: 'small', length: 1 },
  { position: { x: 4, y: 4 }, direction: true, type: 'small', length: 1 },
];
