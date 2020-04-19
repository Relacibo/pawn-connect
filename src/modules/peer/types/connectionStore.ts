import { List } from 'immutable';
import User from './user';
import ConnectionState from './connectionState';

export default class ConnectionStore {
  constructor(
    readonly connState: ConnectionState = new ConnectionState(),
    readonly users: List<User> = List()
  ) {}
}
