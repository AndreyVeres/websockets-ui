import { UserService } from './user.service';
import { User } from './user.model';
import { WebSocket } from 'ws';

export class UserController {
  private userService = new UserService();

  createUser(ws: WebSocket, name: string, password: string) {
    const user = new User({ ws, name, password });
    this.userService.saveUser(user);
  }

  findByWs(ws: WebSocket) {
    return this.userService.findByWs(ws);
  }
}
