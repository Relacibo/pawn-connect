/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import { Map, List } from 'immutable';
import {
  CONNECTING,
  CONNECTED,
  DISCONNECTING,
  DISCONNECTED
} from './enums/connectionState';
import {
  CONNECTING_TO_PEER,
  CONNECTED_TO_PEER,
  DISCONNECTED_FROM_PEER,
  RECEIVED_MESSAGE,
  DISCONNECTING_FROM_PEER,
  SOMEONE_CONNECTED_TO_PEER
} from './enums/actions';
import Message from './types/message';
import MessageStore from './types/messageStore';
import ConnectionState from './types/connectionState';
import User from './types/user';
import State from './types/state';
import ConnectionStore from './types/connectionStore';

function connState(state: ConnectionState, action: Action<string>) {
  switch (action.type) {
    case DISCONNECTED_FROM_PEER:
      return new ConnectionState(DISCONNECTED);
    case CONNECTING_TO_PEER: {
      const { key }: { key: string } = action as any;
      return new ConnectionState(CONNECTING, key);
    }
    case CONNECTED_TO_PEER: {
      const { key }: { key: string } = action as any;
      return new ConnectionState(CONNECTED, key);
    }
    case DISCONNECTING_FROM_PEER: {
      const { key } = action as any;
      return new ConnectionState(DISCONNECTING, key);
    }
    default:
      return state;
  }
}

function users(state: List<User>, action: Action<string>) {
  switch (action.type) {
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
    case CONNECTING_TO_PEER:
    case CONNECTED_TO_PEER:
    case DISCONNECTING_FROM_PEER:
      return connState(state.connState, action);
    case SOMEONE_CONNECTED_TO_PEER:
      return users(state.users, action);
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
      const { data } = action as any;
      const { from, connectionId, payload } = data as any;
      return {
        nextId: nextId + 1,
        receivedMessages: receivedMessages.push(
          new Message(nextId, from, connectionId, payload)
        )
      };
    }
    default:
      return state;
  }
}
