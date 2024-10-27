import { BroadCaster } from './broadCaster';
import EventEmitter from 'events';

const emitter = new EventEmitter();

export abstract class AppEmitter extends BroadCaster {
  constructor() {
    super();
  }
  protected emit(eventName: string | symbol, ...args: any[]) {
    emitter.emit(eventName, ...args);
  }

  protected on(eventName: string | symbol, listener: (...args: any[]) => void) {
    emitter.on(eventName, listener);
  }
}
