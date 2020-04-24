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
  RECEIVED_MESSAGE,
  CREATED_PEER,
  DELETED_PEER
} from './enums/actions';
import Message from './types/message';
import MessageStore from './types/messageStore';
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

function peerId(state: string | null, action: Action<string>) {
  switch (action.type) {
    case DELETED_PEER:
      return null;
    case CREATED_PEER:
      return (action as any).payload.peerId;
    default:
      return state;
  }
}

export function connection(
  state: ConnectionStore = new ConnectionStore(),
  action: Action<string>
) {
  switch (action.type) {
    case DISCONNECTED_FROM_PEER:
    case CONNECTING_WITH_PEER:
    case CONNECTED_WITH_PEER:
      return { ...state, connections: connections(state.connections, action) };
    case CREATED_PEER:
    case DELETED_PEER:
      return { ...state, peerId: peerId(state.peerId, action) };
    default:
      return state;
  }
}

export function messageStore(
  state: MessageStore = new MessageStore(),
  action: Action<string>
) {
  switch (action.type) {
    case RECEIVED_MESSAGE: {
      const { nextId, receivedMessages } = state;
      const { payload: { from, payload } } = action as any;
      return {
        nextId: nextId + 1,
        receivedMessages: receivedMessages.push(
          new Message(nextId, from, payload)
        )
      };
    }
    default:
      return state;
  }
}
