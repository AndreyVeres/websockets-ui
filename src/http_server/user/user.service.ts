import { User } from './user.model';
import { WebSocket } from 'ws';
import { Service } from '../abstract/service';
import { APP_EVENTS, MESSAGES_TYPE } from '../enum/enum';

export class UserService extends Service {
  saveUser(user: User) {
    const existingUser = this.userIsExist(user);

    if (existingUser && existingUser.password === user.password) {
      existingUser.updateSocket(user.$ws);
      this.notifyOne(user, MESSAGES_TYPE.REG, existingUser);

      this.emit(APP_EVENTS.NEED_UPDATE_ROOMS);
      this.emit(APP_EVENTS.NEED_UPDATE_WINNERS);
    }

    if (existingUser && existingUser.password !== user.password) {
      this.notifyOne(user, MESSAGES_TYPE.REG, {
        name: user.name,
        index: user.id,
        error: true,
        errorText: 'invalid password',
      });
    }

    if (!existingUser) {
      this.database.users.push(user);
      this.emit(APP_EVENTS.CREATE_USER, user);
      this.emit(APP_EVENTS.NEED_UPDATE_ROOMS);
      this.emit(APP_EVENTS.NEED_UPDATE_WINNERS);
    }
  }

  userIsExist(user: User) {
    return this.users.find((us) => us.name === user.name);
  }

  findByWs(ws: WebSocket) {
    return this.database.users.find((user) => user.$ws === ws);
  }
}
