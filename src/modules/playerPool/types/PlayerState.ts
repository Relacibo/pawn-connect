export class PlayerState {
  constructor(
    readonly lichessId: string,
    readonly peerId: string,
    readonly isConnected: boolean = true) { }
}
