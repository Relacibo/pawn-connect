import { Map } from 'immutable';
import { PlayerState } from './PlayerState';
import { HostState } from './HostState';
export type PlayerPoolState = {
  type: 'connected',
  host: HostState,
  allowSubscription: boolean,
  members: Map<string, PlayerState>,
  acceptChallenge: string | null
} | {
  type: 'connecting',
  host: HostState
} | {
  type: 'disconnected'
}
export class PlayerPoolConnected {
  readonly type: 'connected' = 'connected'
  constructor(
    readonly host: HostState,
    readonly allowSubscription: boolean = true,
    readonly members: Map<string, PlayerState> = Map(),
    readonly acceptChallenge: string | null = null
  ) { }
}
export class PlayerPoolConnecting {
  readonly type: 'connecting' = 'connecting'
  constructor(
    readonly host: HostState
  ) { }
}
export class PlayerPoolDisconnected {
  readonly type: 'disconnected' = 'disconnected'
  constructor(
  ) { }
}