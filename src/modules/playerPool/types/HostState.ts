export type HostState = {
  isHost: true
} | {
  isHost: false,
  peerId: string
}

export function SelfHost(): HostState {
  return { isHost: true };
}
export function Client(peerId: string): HostState {
  return {
    isHost: false,
    peerId
  }
}
