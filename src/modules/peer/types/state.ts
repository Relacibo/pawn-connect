import { Map, List } from 'immutable';
import ConnectionStore from './connectionStore';

export default class State {
  constructor(
    readonly connection: ConnectionStore = new ConnectionStore()
  ) {}
}
