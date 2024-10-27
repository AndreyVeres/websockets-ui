export enum MESSAGES_TYPE {
  REG = 'reg',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOMS = 'update_room',
  CREATE_ROOM = 'create_room',
  UPDATE_WINNERS = 'update_winners',
  CREATE_GAME = 'create_game',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
  SINGLE = 'single_play',
}

export enum APP_EVENTS {
  CREATE_USER = 'create_user',
  FULL_ROOM = 'full_room',
  NEED_UPDATE_ROOMS = 'need_update_room',
  NEED_UPDATE_WINNERS = 'need_update_winners',
  NEED_REMOVE_ROOM = 'need_remove_room',
}
