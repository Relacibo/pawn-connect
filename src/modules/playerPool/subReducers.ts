import { Action } from "redux";
import { Map } from 'immutable';
import { CREATE_PLAYER_POOL, DELETE_PLAYER_POOL, RECEIVED_SUBSCRIBE_REQUEST, RECEIVED_UNSUBSCRIBE_REQUEST, RECEIVED_MEMBERS_UPDATE, RECEIVED_LICHESS_CHALLENGE_COMMAND, RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND } from "./enums/actions";
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
    case RECEIVED_SUBSCRIBE_REQUEST: {
      if (!state || !state.allowSubscription) {
        return state;
      }
      const { lichessId, peerId } = (action as any).payload;
      return { ...state, members: state.members.set(lichessId, new PlayerState(lichessId, peerId)) }
    }
    case RECEIVED_UNSUBSCRIBE_REQUEST: {
      if (!state) {
        return state;
      }
      const { peerId } = (action as any).payload;
      const lichessId = state.members.find(p => p.peerId == peerId)?.lichessId
      return lichessId ? { ...state, members: state.members.delete(lichessId) } : state;
    }

    case RECEIVED_MEMBERS_UPDATE: {
      const { peerIds, lichessIds } = (action as any).payload;
      if (!state) {
        return state;
      }
      return {
        ...state, members: Map(zip(lichessIds, peerIds).map(p => {
          const [lichessId, peerId] = p;
          return [lichessId, new PlayerState(lichessId, peerId)];
        }))
      }
    }
    case RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND: {
      if (!state) {
        return state;
      }
      const { lichessId } = (action as any).payload;
      return {
        ...state, acceptChallenge: lichessId
      }
    }
    default:
      return state;
  }
}
