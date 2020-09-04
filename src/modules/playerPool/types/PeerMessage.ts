type PeerMessage = {
  type: 'subscribe',
  lichessId: string
} | {
  type: 'unsubscribe'
} | {
  type: 'ok',
  answerTo: string
} | {
  type: 'error',
  answerTo: string
} | {
  type: 'update_members',
  peerIds: string[],
  lichessIds: string[]
} | {
  type: 'challenge',
  lichessId: string,
  params: any
} | {
  type: 'accept_challenge',
  lichessId: string
}
