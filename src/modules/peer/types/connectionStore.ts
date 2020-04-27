import { Map } from 'immutable';

export default class ConnectionStore {
  constructor(
    readonly peerId: string | null = null,
    readonly connections: Map<string, number> = Map(),
  ) {}
}
