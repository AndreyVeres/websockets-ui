import { BotController } from './bot/bot.controller';
import { MessageParser } from './utils/messageParser';
import { GameController } from './game/game.controller';
import { RoomController } from './room/room.controller';
import { UserController } from './user/user.controller';
import { AddShipsRequestData, AddUserToRoomRequestData, AttackRequestData, Message, RandomAttackRequestData, RegRequestData } from './types';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import { MESSAGES_TYPE } from './enum/enum';

export class App {
  private socket = new WebSocketServer({ port: 3000 });
  private userController = new UserController();
  private roomController = new RoomController();
  private gameController = new GameController();
  private messageParser = new MessageParser();
  private bot = new BotController(this.gameController, this.roomController, this.userController);

  start() {
    this.socket.on('connection', (ws) => {
      const fn = ws.send.bind(ws);
      ws.send = (data) => {
        // console.log('send: ', data);
        fn(data);
      };

      ws.on('message', (message) => {
        this.handleMessage(ws, message);
      });
      ws.on('close', () => {
        this.handleDisconnect(ws);
        ws.terminate();
      });
    });

    return this;
  }

  handleAttack(data: AttackRequestData) {
    this.gameController.attack(data);
  }

  handleRandomAttach(data: RandomAttackRequestData) {
    this.gameController.onRandomAttach(data);
  }

  handleSinglePlay(ws: WebSocket) {
    this.bot.init(ws);
  }

  private handleMessage(ws: WebSocket, message: RawData) {
    try {
      const { type, data }: Message = JSON.parse(message.toString());
      const handlers: Partial<Record<MESSAGES_TYPE, (data: string) => void>> = {
        [MESSAGES_TYPE.REG]: (data) => this.handleCreateUser(ws, this.messageParser.parse(MESSAGES_TYPE.REG, data)),
        [MESSAGES_TYPE.CREATE_ROOM]: () => this.handleCreateRoom(ws),
        [MESSAGES_TYPE.ADD_USER_TO_ROOM]: (data) => this.handleAddToRoom(ws, this.messageParser.parse(MESSAGES_TYPE.ADD_USER_TO_ROOM, data)),
        [MESSAGES_TYPE.ADD_SHIPS]: (data) => this.handleAddShips(this.messageParser.parse(MESSAGES_TYPE.ADD_SHIPS, data)),
        [MESSAGES_TYPE.ATTACK]: (data) => this.handleAttack(this.messageParser.parse(MESSAGES_TYPE.ATTACK, data)),
        [MESSAGES_TYPE.RANDOM_ATTACK]: (data) => this.handleRandomAttach(this.messageParser.parse(MESSAGES_TYPE.RANDOM_ATTACK, data)),
        [MESSAGES_TYPE.SINGLE]: (data) => this.handleSinglePlay(ws),
      };

      const handler = handlers[type];

      if (handler) {
        handler(data);
      } else {
        console.log(type, data, 'unknown');
        this.handleUnknownCommand(ws);
      }
    } catch (error) {
      this.handleError(ws, error);
    }
  }

  private handleUnknownCommand(ws: WebSocket) {
    ws.send(JSON.stringify({ error: 'Unknown command' }));
  }

  private handleError(ws: WebSocket, error: unknown) {
    console.error('Internal server error');
    ws.send(JSON.stringify({ error: 'Internal server error' }));
  }

  private handleDisconnect(ws: WebSocket) {
    const user = this.userController.findByWs(ws);
    if (!user) return;

    this.roomController.removeUserRooms(user);
  }

  private handleAddShips(data: AddShipsRequestData) {
    const { gameId, ships, indexPlayer } = data;
    this.gameController.addShipsToGame(gameId, ships, indexPlayer);
  }

  private handleAddToRoom(ws: WebSocket, data: AddUserToRoomRequestData) {
    const { indexRoom } = data;
    const user = this.userController.findByWs(ws);

    if (!user) {
      return;
    }
    this.roomController.handleAddUserInRoom(user, indexRoom);
  }

  private handleCreateUser(ws: WebSocket, data: RegRequestData) {
    const { password, name } = data;
    this.userController.createUser(ws, name, password);
  }

  private handleCreateRoom(ws: WebSocket) {
    const user = this.userController.findByWs(ws);
    if (!user) {
      return;
    }
    this.roomController.createRoom(user);
  }

  get on() {
    return this.socket.on.bind(this.socket);
  }
}
