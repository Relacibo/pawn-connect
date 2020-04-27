export function getPeerIDFromLichessID(lichessID: string) {
  return `pawn-connect-lichess-${lichessID.toLowerCase()}`;
}
