import { v4 as uuid } from 'uuid';
import { Ship } from './ship.model';
import { User } from '../user/user.model';
import { Model } from '../abstract/model';
import { ShipPosition } from '../types';

type GameState = 'pending' | 'ready';

export class Game implements Model {
  idGame = uuid();
  gameStatus: GameState = 'pending';
  private players: Record<string, User> = {};
  private ships: Record<string, Ship[]> = {};
  currentPlayerIndex = '';
  currentEnemy = '';
  private playersReady = 0;
  private shots: Record<string, Set<string>> = {};
  singleGame: boolean;

  getRandomAvailableCoordinates(): ShipPosition {
    const availableCells: ShipPosition[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cellKey = `${x},${y}`;
        if (!this.shots[this.currentPlayerIndex].has(cellKey)) {
          availableCells.push({ x, y });
        }
      }
    }
    return this.shuffleArray(availableCells)[0];
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  recordShot(x: number, y: number) {
    this.shots[this.currentPlayerIndex].add(`${x},${y}`);
  }

  get shotRecords() {
    return this.shots[this.currentPlayerIndex];
  }

  get isFinished() {
    return this.enemyShips.length === 0;
  }

  get data() {
    return {
      currentPlayerIndex: this.currentPlayerIndex,
      ships: this.ships[this.currentPlayerIndex],
    };
  }

  get playersRoles() {
    return {
      currentPlayer: this.players[this.currentPlayerIndex],
      enemyPlayer: this.players[this.currentEnemy],
    };
  }

  get enemyShips() {
    return this.ships[this.currentEnemy].filter((ship) => ship.status !== 'killed');
  }

  get playersSockets() {
    return Object.values(this.players);
  }

  nextPlayerTurn() {
    const currentPlayer = this.currentPlayerIndex;
    const currentEnemy = this.currentEnemy;

    this.currentEnemy = currentPlayer;
    this.currentPlayerIndex = currentEnemy;
  }

  addPlayerShips(playerId: string, ships: Ship[]) {
    this.ships[playerId].push(...ships);

    this.playersReady++;
    if (this.playersReady === 2) {
      this.gameStatus = 'ready';
    }
  }

  constructor(users: User[]) {
    const [player1, player2] = users;

    this.players[player1.id] = player1;
    this.players[player2.id] = player2;

    this.ships[player1.id] = [];
    this.ships[player2.id] = [];

    this.currentPlayerIndex = player1.id;
    this.currentEnemy = player2.id;

    this.shots[player1.id] = new Set();
    this.shots[player2.id] = new Set();
  }
}
