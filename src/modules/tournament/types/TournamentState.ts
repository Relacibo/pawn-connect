import { Map } from 'immutable';
export class TournamentState {
  constructor(
    readonly allowSubscription: boolean = true,
    readonly members: Map<string, string> = Map()
  ) { }
}
