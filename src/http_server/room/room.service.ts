import { APP_EVENTS } from '../enum/enum';
import { Room } from './room.model';
import { Service } from '../abstract/service';

export class RoomService extends Service {
  constructor() {
    super();
  }

  saveRoom(room: Room) {
    this.rooms.push(room);
    this.emit(APP_EVENTS.NEED_UPDATE_ROOMS);
  }

  getById(id: string) {
    return this.rooms.find((room) => room.roomId === id);
  }

  getUserRooms(userId: string) {
    return this.rooms.filter((room) => room.creator.id === userId);
  }

  remove(room: Room) {
    this.removeRoom(room);
    this.emit(APP_EVENTS.NEED_UPDATE_ROOMS);
  }

  updateRoom(room: Room) {
    if (room.isFull) {
      this.emit(APP_EVENTS.FULL_ROOM, room);
    }
  }
}
