import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { App } from './app';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT;

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const app = new App();

app.start().on('listening', () => {
  console.warn(`WebSocket server is listening on port ${PORT}`);
});
