import { Map } from 'immutable';
import { PlayerState } from './PlayerState';
export class PlayerPoolState {
  constructor(
    readonly allowSubscription: boolean = true,
    readonly members: Map<string, PlayerState> = Map(),
    readonly isHost = false
  ) { }
}
