import { extractData } from '../utils/extractData';
import { AppEmitter } from './emitter';
import { Database } from '../database';
import { APP_EVENTS, MESSAGES_TYPE } from '../enum/enum';
import { Room } from '../room/room.model';

const database = new Database();

let instance = false;
export abstract class Service extends AppEmitter {
  protected database = database;

  constructor() {
    super();

    if (!instance) {
      this.on(APP_EVENTS.CREATE_USER, (user) => this.notifyOne(user, MESSAGES_TYPE.REG, extractData(user)));
      this.on(APP_EVENTS.NEED_UPDATE_ROOMS, () => {
        this.notifyAll(this.users, MESSAGES_TYPE.UPDATE_ROOMS, extractData(this.rooms));
      });
      this.on(APP_EVENTS.NEED_UPDATE_WINNERS, () => this.notifyAll(this.users, MESSAGES_TYPE.UPDATE_WINNERS, this.winners));
      this.on(APP_EVENTS.NEED_REMOVE_ROOM, (room) => this.removeRoom(room));
    }

    instance = true;
  }

  protected get users() {
    return this.database.users;
  }

  protected get rooms() {
    return this.database.rooms;
  }

  protected get games() {
    return this.database.games;
  }

  protected removeRoom(room: Room) {
    this.database.rooms = this.database.rooms.filter((rm) => rm !== room);
  }

  protected get winners() {
    return this.database.users.map((user) => ({
      name: user.name,
      wins: user.wins,
    }));
  }
}
