import { Action } from "redux";
import { Map } from 'immutable';
import { CREATE_PLAYER_POOL, DELETE_PLAYER_POOL, RECEIVED_SUBSCRIBE_REQUEST, RECEIVED_UNSUBSCRIBE_REQUEST, RECEIVED_MEMBERS_UPDATE, RECEIVED_LICHESS_CHALLENGE_COMMAND, RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND, PLAYER_POOL_SUBSCRIPTION_SUCCESS, CONNECTING_TO_PLAYER_POOL } from "./enums/actions";
import { PlayerPoolState, PlayerPoolConnected, PlayerPoolDisconnected, PlayerPoolConnecting } from "./types/PlayerPoolState";
import { PlayerState } from "./types/PlayerState";
import { SelfHost, Client } from "./types/HostState";
import { zip } from "@root/util/util";

export function playerPoolState(state: PlayerPoolState = new PlayerPoolDisconnected(), action: Action<string>): PlayerPoolState {
  switch (action.type) {
    case CREATE_PLAYER_POOL: {
      return new PlayerPoolConnected(SelfHost());
    }
    case CONNECTING_TO_PLAYER_POOL: {
      const { peerId }: { peerId: string } = (action as any).payload;
      return new PlayerPoolConnecting(Client(peerId))
    }
    case PLAYER_POOL_SUBSCRIPTION_SUCCESS: {
      const { peerId }: { peerId: string } = (action as any).payload;
      return new PlayerPoolConnected(Client(peerId));
    }
    case DELETE_PLAYER_POOL: {
      return new PlayerPoolDisconnected()
    }
    case RECEIVED_SUBSCRIBE_REQUEST: {
      if (state.type != 'connected' || !state.host.isHost || !state.allowSubscription) {
        return state;
      }
      const { lichessId, peerId }: { lichessId: string, peerId: string } = (action as any).payload;
      return { ...state, members: state.members.set(lichessId, new PlayerState(lichessId, peerId)) }
    }
    case RECEIVED_UNSUBSCRIBE_REQUEST: {
      if (state.type != 'connected' || !state.host.isHost) {
        return state;
      }
      const { peerId } = (action as any).payload;
      const lichessId = state.members.find(p => p.peerId == peerId)?.lichessId
      return lichessId ? { ...state, members: state.members.delete(lichessId) } : state;
    }

    case RECEIVED_MEMBERS_UPDATE: {
      const { peerIds, lichessIds } = (action as any).payload;
      if (state.type != 'connected') {
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
      if (state.type != 'connected') {
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
