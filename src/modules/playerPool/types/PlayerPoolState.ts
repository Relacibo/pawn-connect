import { Map } from 'immutable';
import { PlayerState } from './PlayerState';
import { HostState } from './HostState';
export class PlayerPoolState {
  constructor(
    readonly host: HostState,
    readonly allowSubscription: boolean = true,
    readonly members: Map<string, PlayerState> = Map()
  ) { }
}
