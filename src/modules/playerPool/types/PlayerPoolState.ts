import { Map } from 'immutable';
export class PlayerPoolState {
  constructor(
    readonly allowSubscription: boolean = true,
    readonly members: Map<string, string> = Map()
  ) { }
}
