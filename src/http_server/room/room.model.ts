import { v4 as uuid } from 'uuid';
import { User } from '../user/user.model';
import { Model } from '../abstract/model';

export class Room implements Model {
  roomId = uuid();
  roomUsers: User[] = [];
  creator: User;

  constructor(creator: User) {
    this.creator = creator;
  }

  addUser(user: User) {
    if (this.isFull) return;

    if (this.roomUsers.includes(user)) {
      return;
    }

    this.roomUsers.push(user);
  }

  get data() {
    return {
      roomId: this.roomId,
      roomUsers: this.roomUsers.map((user) => ({
        name: user.name,
        index: user.id,
      })),
    };
  }

  get isFull() {
    const usersCount = this.roomUsers.length;

    if (usersCount === 2) {
      return true;
    }

    return false;
  }
}
