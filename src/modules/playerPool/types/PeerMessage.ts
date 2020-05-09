type PeerMessage = {
  type: 'subscribe',
  lichessId: string
} | {
  type: 'unsubscribe'
} | {
  type: 'ok'
} | {
  type: 'error'
}
