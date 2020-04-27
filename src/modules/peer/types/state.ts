import { Map, List } from 'immutable';
import ConnectionStore from './connectionStore';
import Message from './message';

export default class State {
  constructor(
    readonly connection: ConnectionStore = new ConnectionStore(),
    readonly receivedMessages: List<Message> = List()
  ) {}
}
