import { MessagePayloadMap } from './../types';

export class MessageParser {
  parse<T extends keyof MessagePayloadMap>(_: T, data: string) {
    const res = JSON.parse(data);
    return res as MessagePayloadMap[T];
  }
}
