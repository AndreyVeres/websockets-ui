import { RoomService } from './room.service';
import { Room } from './room.model';
import { User } from '../user/user.model';

export class RoomController {
  private roomService = new RoomService();

  createRoom(user: User) {
    const room = new Room(user);
    room.addUser(user);
    this.roomService.saveRoom(room);

    return room;
  }

  removeUserRooms(user: User) {
    const rooms = this.roomService.getUserRooms(user.id);
    rooms.forEach((room) => this.roomService.remove(room));
  }

  handleAddUserInRoom(user: User, roomId: string) {
    const room = this.roomService.getById(roomId);

    if (!room) {
      return;
    }

    room.addUser(user);
    this.roomService.updateRoom(room);
  }
}
