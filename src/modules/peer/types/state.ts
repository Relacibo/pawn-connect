import { Map, List } from 'immutable';
import ConnectionState from './connectionState';
import Message from './message';

export default class State {
  constructor(
    readonly connection: ConnectionState = new ConnectionState(),
    readonly receivedMessages: List<Message> = List()
  ) {}
}
