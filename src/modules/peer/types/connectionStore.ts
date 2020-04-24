import { Map } from 'immutable';
import { DISCONNECTED } from '../enums/connectionState';

export default class ConnectionStore {
  constructor(
    readonly peerId: string | null = null,
    readonly connections: Map<string, number> = Map(),
  ) {}
}
