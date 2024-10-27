import { Ship } from './ship.model';
import { GameService } from './game.service';
import { AttackRequestData, RandomAttackRequestData } from '../types';
import { Room } from '../room/room.model';

export class GameController {
  private gameService = new GameService();

  createGame(room: Room) {
    this.gameService.createGame(room);
  }

  findGameById(id: string) {
    return this.gameService.findById(id);
  }

  addShipsToGame(gameId: string, ships: Ship[], indexPlayer: string) {
    const game = this.gameService.findById(gameId);

    if (!game) return;

    const shipsModels = ships.map((shipDto) => new Ship(shipDto));
    game.addPlayerShips(indexPlayer, shipsModels);
    this.gameService.updateGame(game);
  }

  onRandomAttach(data: RandomAttackRequestData) {
    const { indexPlayer, gameId } = data;

    const game = this.gameService.findById(gameId);
    if (!game) return;
    const { x, y } = game.getRandomAvailableCoordinates();

    console.log(x, y, '1');
    this.attack({ indexPlayer, gameId, x, y }, true);
  }

  attack(data: AttackRequestData, isRandom?: boolean) {
    const { indexPlayer, gameId, x, y } = data;

    const game = this.gameService.findById(gameId);
    if (!game) return;

    const { playersRoles, enemyShips, currentPlayerIndex } = game;

    if (indexPlayer !== currentPlayerIndex) return;

    if (game.shotRecords.has(`${x},${y}`)) {
      return;
    }

    game.recordShot(x, y);
    const { currentPlayer, enemyPlayer } = playersRoles;

    const { ship, status } = this.gameService.fireOnShips(x, y, enemyShips);

    this.gameService.onShot(game, status, x, y, isRandom);

    if (status === 'killed') {
      this.gameService.shipKilled(game, ship, isRandom);
      ship.killedField.forEach(({ x, y }) => game.recordShot(x, y));
    }

    const nextTurnPlayer = status === 'miss' ? enemyPlayer.id : currentPlayer.id;

    if (game.isFinished) {
      this.gameService.onGameFinish(game, currentPlayer);
    }

    if (status === 'miss') {
      game.nextPlayerTurn();
    }

    this.gameService.endTurn(game, nextTurnPlayer);
  }
}
