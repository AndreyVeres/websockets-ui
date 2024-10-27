import { MESSAGES_TYPE } from './enum/enum';
import { Ship } from './game/ship.model';

export type RegRequestData = {
  name: string;
  password: string;
};

export type RegResponseData = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export type Message = {
  type: MESSAGES_TYPE;
  data: string;
  id: number;
};

export interface AddUserToRoomRequestData {
  indexRoom: string;
}

export interface AddShipsRequestData {
  gameId: string;
  ships: Ship[];
  indexPlayer: string;
}

export interface AttackRequestData {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
}

export interface RandomAttackRequestData {
  gameId: string;
  indexPlayer: string;
}

// export type ShipSize = 'small' | 'medium' | 'large' | 'huge';
export type ShipPosition = { x: number; y: number };

export type MessagePayloadMap = {
  [MESSAGES_TYPE.REG]: RegRequestData;
  [MESSAGES_TYPE.CREATE_ROOM]: string;
  [MESSAGES_TYPE.ADD_USER_TO_ROOM]: AddUserToRoomRequestData;
  [MESSAGES_TYPE.ADD_SHIPS]: AddShipsRequestData;
  [MESSAGES_TYPE.ATTACK]: AttackRequestData;
  [MESSAGES_TYPE.RANDOM_ATTACK]: RandomAttackRequestData;
  [MESSAGES_TYPE.SINGLE]: string;
};
