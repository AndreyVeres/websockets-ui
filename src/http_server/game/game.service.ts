import { APP_EVENTS, MESSAGES_TYPE } from './../enum/enum';
import { Room } from '../room/room.model';
import { Game } from './game.model';
import { Service } from '../abstract/service';
import { Ship } from './ship.model';
import { User } from '../user/user.model';

export class GameService extends Service {
  constructor() {
    super();
    this.on(APP_EVENTS.FULL_ROOM, (room) => this.createGame(room));
  }

  findById(id: string) {
    return this.games.find((game) => game.idGame === id);
  }

  fireOnShips(x: number, y: number, ships: Ship[]) {
    return ships.reduce(
      (acc, ship) => {
        const isHit = ship.isHit(x, y);
        if (isHit) {
          acc = {
            ship,
            status: ship.status,
          };
        }
        return acc;
      },
      { ship: {} as Ship, status: 'miss' }
    );
  }

  shipKilled(game: Game, ship: Ship, isRandom: boolean = false) {
    const { playersSockets, currentPlayerIndex } = game;
    const { killedField } = ship;

    killedField.forEach((field) => {
      this.notifyAll(playersSockets, MESSAGES_TYPE.ATTACK, {
        position: field,
        currentPlayer: currentPlayerIndex,
        status: 'miss',
      });
    });
  }

  endTurn(game: Game, nextPlayerId: string) {
    const { playersSockets } = game;

    this.notifyAll(playersSockets, MESSAGES_TYPE.TURN, {
      currentPlayer: nextPlayerId,
    });
  }

  onGameFinish(game: Game, winner: User) {
    winner.addWin();

    this.notifyAll(game.playersSockets, MESSAGES_TYPE.FINISH, {
      winPlayer: winner.id,
    });
    this.emit(APP_EVENTS.NEED_UPDATE_WINNERS);
  }

  onShot(game: Game, status: string, x: number, y: number, isRandom: boolean = false) {
    const { playersSockets, currentPlayerIndex } = game;

    this.notifyAll(playersSockets, MESSAGES_TYPE.ATTACK, {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: status,
    });
  }

  createGame(room: Room) {
    const { roomUsers } = room;
    const game = new Game(roomUsers);
    this.games.push(game);

    roomUsers.forEach((user) => {
      this.notifyOne(user, MESSAGES_TYPE.CREATE_GAME, {
        idGame: game.idGame,
        idPlayer: user.id,
      });
    });

    this.emit(APP_EVENTS.NEED_REMOVE_ROOM, room);
    this.emit(APP_EVENTS.NEED_UPDATE_ROOMS);
  }

  updateGame(game: Game) {
    const { data, playersSockets, gameStatus } = game;
    if (gameStatus === 'ready') {
      playersSockets.forEach((user) => {
        this.notifyOne(user, MESSAGES_TYPE.START_GAME, data);
      });
    }
  }
}
