/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import { Map, List } from 'immutable';
import {
  CONNECTING,
  CONNECTED,
  DISCONNECTED
} from './enums/connectionState';
import {
  CONNECTING_WITH_PEER,
  CONNECTED_WITH_PEER,
  DISCONNECTED_FROM_PEER,
  RECEIVED_DATA_FROM_PEER,
  CREATED_PEER,
  DELETED_PEER
} from './enums/actions';
import ConnectionStore from './types/connectionStore';

function connections(state: Map<string, number> = Map(), action: Action<string>) {
  let a = action as any;
  switch (action.type) {
    case DISCONNECTED_FROM_PEER:
      return state.delete(a.payload.peerId);
    case CONNECTING_WITH_PEER:
      return state.set(a.payload.peerId, CONNECTING);
    case CONNECTED_WITH_PEER:
      return state.set(a.payload.peerId, CONNECTED);;
    default:
      return state;
  }
}

export function connection(
  state: ConnectionStore | null = null,
  action: Action<string>
): ConnectionStore | null {
  switch (action.type) {
    case DISCONNECTED_FROM_PEER:
    case CONNECTING_WITH_PEER:
    case CONNECTED_WITH_PEER: {
      if (!state) {
        return state;
      }
      return { ...state, connections: connections(state.connections, action) };
    }
    case CREATED_PEER:
      return new ConnectionStore((action as any).payload.peerId);
    case DELETED_PEER:
      return null;
    default:
      return state;
  }
}
