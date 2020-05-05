export class PlayerState {
  constructor(
    readonly lichessId: string,
    readonly peerId: string,
    isHost: boolean = false,
    readonly isConnected: boolean = true) { }
}
