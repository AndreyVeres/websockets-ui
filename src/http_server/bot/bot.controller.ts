import { GameController } from './../game/game.controller';
import { UserController } from './../user/user.controller';
import { RoomController } from './../room/room.controller';
import { Bot } from './bot.model';
import { WebSocket } from 'ws';
import { MESSAGES_TYPE } from '../enum/enum';

export class BotController {
  private gameController: GameController;
  private roomController: RoomController;
  private userController: UserController;

  private botInstance: Bot;

  constructor(gameController: GameController, roomController: RoomController, userController: UserController) {
    this.gameController = gameController;
    this.roomController = roomController;
    this.userController = userController;
  }

  private createBot() {
    const socket = new WebSocket('ws://localhost:3000');
    const bot = new Bot({ ws: socket, name: 'bot', password: '123' });

    this.botInstance = bot;
    return bot;
  }

  init(ws: WebSocket) {
    const bot = this.createBot();

    bot.on('open', () => {
      const client = this.userController.findByWs(ws);
      const room = this.roomController.createRoom(client!);
      bot.reg();
      bot.assignInRomm(room);
    });

    bot.on('message', (msg) => {
      const { type, data } = JSON.parse(msg.toString());

      if (type === MESSAGES_TYPE.CREATE_GAME) {
        const { idGame, idPlayer } = JSON.parse(data);
        bot.id = idPlayer;
        bot.placeShips(idGame, bot.id);
        const game = this.gameController.findGameById(idGame)!;

        bot.addGame(game);
      }

      if (type === MESSAGES_TYPE.TURN) {
        const { currentPlayer } = JSON.parse(data);
        if (currentPlayer === bot.id) {
          bot.attack(currentPlayer);
        }
      }
    });
  }
}
