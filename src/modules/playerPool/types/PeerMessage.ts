type PeerMessage = {
  type: 'subscribe',
  lichessId: string
} | {
  type: 'unsubscribe'
} | {
  type: 'ok'
} | {
  type: 'error'
} | {
  type: 'update_members',
  peerIds: string[],
  lichessIds: string[]
} | {
  type: 'challenge',
  lichessId: string
} | {
  type: 'accept_challenge',
  lichessId: string
}
