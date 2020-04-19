import { List } from 'immutable';
import Message from './message';

export default class MessageStore {
  constructor(
    readonly nextId: number = 0,
    readonly receivedMessages: List<Message> = List()
  ) {}
}
