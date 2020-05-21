import { Action } from "redux";
import { Map } from 'immutable';
import { CREATE_PLAYER_POOL, ESTABLISHED_CONNECTION_TO_PLAYER, DELETE_PLAYER_POOL } from "./enums/actions";
import { CREATED_PEER, DELETED_PEER, RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { PlayerPoolState } from "./types/PlayerPoolState";
import { PlayerState } from "./types/PlayerState";
import { HostState, SelfHost, Client } from "./types/HostState";
import { zip } from "@root/util/util";

export function playerPoolState(state: PlayerPoolState | null = null, action: Action<string>): PlayerPoolState | null {
  switch (action.type) {
    case CREATE_PLAYER_POOL: {
      const payload = (action as any).payload;
      const host = payload.asHost ? SelfHost() : Client(payload.peerId);
      return new PlayerPoolState(host);
    }
    case DELETE_PLAYER_POOL: {
      return null
    }
    case RECEIVED_DATA_FROM_PEER: {
      let s = state;
      if (!s) {
        return state;
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
        case 'update_members': {
          if (!state!.host.isHost && state!.host.peerId == peerId) {
            return {
              ...s, members: Map(zip(peerMessage.peerIds, peerMessage.lichessIds).map(p => {
                const [peerId, lichessId] = p;
                return [peerId, new PlayerState(lichessId, peerId)];
              }))
            }
          } else {
            return state;
          }

        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
