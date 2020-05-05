import { Action } from "redux";
import { SWITCH_VIEW, CREATE_PLAYER_POOL, ESTABLISHED_CONNECTION_TO_PLAYER } from "./enums/actions";
import { CREATED_PEER, DELETED_PEER, RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { PlayerPoolState } from "./types/PlayerPoolState";
import { PlayerState } from "./types/PlayerState";

export function playerPoolState(state: PlayerPoolState | null = null, action: Action<string>) {
  switch (action.type) {
    case CREATE_PLAYER_POOL: {
      const newState = (action as any).payload as PlayerPoolState;
      return { ...new PlayerPoolState(), ...newState, isHost: true };
    }
    case RECEIVED_DATA_FROM_PEER: {
      let s = state;
      if (!s) {
        s = new PlayerPoolState();
      }
      const { data, peerId } = (action as any).payload;
      const peerMessage: PeerMessage = data as PeerMessage;
      switch (peerMessage.type) {
        case 'subscribe': {
          if (!s.allowSubscription) {
            return state;
          }
          const { lichessId } = peerMessage;
          return { ...s, members: s.members.set(peerId, new PlayerState(lichessId, peerId)) }
        }
        case 'unsubscribe': {
          return { ...s, members: s.members.delete(peerId) }
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
