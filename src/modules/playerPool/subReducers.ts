import { Action } from "redux";
import { UIState } from "./types/UIState";
import { SWITCH_VIEW, CREATE_PLAYER_POOL } from "./enums/actions";
import { CREATED_PEER, DELETED_PEER, RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { PlayerPoolState } from "./types/PlayerPoolState";

export function conditionsMet(state: boolean = false, action: Action<string>) {
  switch (action.type) {
    case CREATED_PEER:
      return true;
    case DELETED_PEER:
      return false;
    default:
      return state;
  }
}

function viewId(state: string, action: Action<string>) {
  switch (action.type) {
    case SWITCH_VIEW: {
      const { payload: { viewId } } = (action as any);
      return viewId;
    }
    default:
      return state;
  }
}

export function uiState(state: UIState = new UIState(), action: Action<string>) {
  switch (action.type) {
    case SWITCH_VIEW: {
      return { ...state, viewId: viewId(state.viewId, action) };
    }
    default:
      return state;
  }
}

export function playerPoolState(state: PlayerPoolState | null = null, action: Action<string>) {
  switch (action.type) {
    case CREATE_PLAYER_POOL: {
      const newState = (action as any).payload as PlayerPoolState;
      return { ...newState };
    }
    case RECEIVED_DATA_FROM_PEER: {
      if (!state)
        return state;
      const { data, peerId } = (action as any).payload;
      const peerMessage: PeerMessage = data as PeerMessage;
      switch (peerMessage.type) {
        case 'subscribe': {
          if (!state.allowSubscription) {
            return state;
          }
          const { lichessId } = peerMessage;
          return { ...state, members: state.members.set(peerId, lichessId) }
        }
        case 'unsubscribe': {
          return { ...state, members: state.members.delete(peerId) }
        }
      }
      return state;
    }
    default:
      return state;
  }
}
