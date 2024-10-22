import { WebSocketServer } from 'ws';
const rooms = new Map();
const players = new Map();

export class App {
  socket = new WebSocketServer({ port: 3000 });

  notify(data: any) {
    this.socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', data: data.data }));
      }
    });
  }

  get on() {
    return this.socket.on.bind(this.socket);
  }

  init() {
    this.socket.on('connection', (ws) => {
      ws.on('message', (message) => {
        const { type, data } = JSON.parse(message.toString());
        const msg = data && JSON.parse(data);

        switch (type) {
          case 'reg':
            this.handlePlayerRegistration(ws, msg);
            break;
          case 'create_room':
            this.handleCreateRoom(ws);
            break;

          default:
            ws.send(JSON.stringify({ error: 'Unknown command' }));
        }
      });

      ws.on('close', () => {});
    });

    return this;
  }

  handlePlayerRegistration(ws: any, data: any) {
    const { name, password } = data;

    if (!players.has(name)) {
      players.set(name, { password, wins: 0 });
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name: name,
            error: false,
            errorText: '',
            index: 1,
          }),
          id: 1,
        })
      );
    } else {
      ws.send(JSON.stringify({ type: 'reg', data: { error: true, errorText: 'Player already exists' }, id: 0 }));
    }
  }

  handleCreateRoom(ws: any) {
    const roomId = generateUniqueId();
    rooms.set(roomId, { players: [ws], gameState: {} });
    ws.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
          idGame: 1,
          idPlayer: 1,
        }),
        id: 0,
      })
    );
  }
}
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
