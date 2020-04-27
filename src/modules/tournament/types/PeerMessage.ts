type PeerMessage = {
  type: 'subscribe',
  lichessId: string
} | {
  type: 'unsubscribe'
}
