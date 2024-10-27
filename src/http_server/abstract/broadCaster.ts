import { User } from '../user/user.model';

export abstract class BroadCaster {
  protected notifyOne(user: User, type: string, data: unknown) {
    user.$ws.send(
      JSON.stringify({
        type,
        data: JSON.stringify(data),
      })
    );
  }

  protected notifyAll(users: User[], type: string, data: unknown) {
    users.forEach(({ $ws }) => {
      $ws.send(
        JSON.stringify({
          type: type,
          data: JSON.stringify(data),
        })
      );
    });
  }
}
