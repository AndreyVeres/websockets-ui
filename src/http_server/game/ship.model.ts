import { ShipPosition } from '../types';

export type ShipStatus = 'alive' | 'killed' | 'shot';

export class Ship {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: string;
  hits: number = 0;
  status: ShipStatus = 'alive';

  constructor(dto: Ship) {
    this.position = dto.position;
    this.direction = dto.direction;
    this.length = dto.length;
    this.type = dto.type;
  }

  get isHorizontalShip() {
    return this.direction === false;
  }

  get killedField(): ShipPosition[] {
    if (this.status !== 'killed') return [];

    const { x: shipX, y: shipY } = this.position;
    const affectedCells: ShipPosition[] = [];

    const startX = this.isHorizontalShip ? shipX - 1 : shipX - 1;
    const endX = this.isHorizontalShip ? shipX + this.length : shipX + 1;
    const startY = this.isHorizontalShip ? shipY - 1 : shipY - 1;
    const endY = this.isHorizontalShip ? shipY + 1 : shipY + this.length;

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        if (x >= 0 && x < 10 && y >= 0 && y < 10) {
          if (this.isHorizontalShip) {
            if (!(x >= shipX && x < shipX + this.length && y === shipY)) {
              affectedCells.push({ x, y });
            }
          } else {
            if (!(y >= shipY && y < shipY + this.length && x === shipX)) {
              affectedCells.push({ x, y });
            }
          }
        }
      }
    }

    return affectedCells;
  }

  private calcHit(x: number, y: number): boolean {
    const { x: shipX, y: shipY } = this.position;
    if (this.isHorizontalShip) {
      const shipBeginX = shipX;
      const shipEndX = shipX + this.length - 1;
      return y === shipY && x >= shipBeginX && x <= shipEndX;
    } else {
      const shipBeginY = shipY;
      const shipEndY = shipY + this.length - 1;
      return x === shipX && y >= shipBeginY && y <= shipEndY;
    }
  }

  isHit(x: number, y: number): boolean {
    if (this.calcHit(x, y)) {
      this.hits += 1;
      this.status = 'shot';
      if (this.hits >= this.length) {
        this.status = 'killed';
      }
      return true;
    }
    return false;
  }
}
