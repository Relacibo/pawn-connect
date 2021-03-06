import crypto from 'crypto'
const hash = crypto.createHash('sha256');
export function getPeerIDFromLichessID(lichessID: string) {
  let h = hash.update(lichessID.toLowerCase()).digest('hex');
  return `pawn-connect-lichess-${h}`;
}

export function zip(arr: any[], ...arrs: any[][]) {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}
