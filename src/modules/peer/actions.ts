import Peer, { DataConnection } from 'peerjs';
import { Map } from 'immutable';
import {
  DISCONNECTED_FROM_PEER,
  CONNECTING_TO_PEER,
  CONNECTED_TO_PEER,
  DISCONNECTING_FROM_PEER,
  RECEIVED_MESSAGE,
  SEND_MESSAGE,
  SOMEONE_CONNECTED_TO_PEER
} from './enums/actions';
import { Dispatch } from '@root/root/types';

let connections: Map<String, DataConnection> = Map();

export function disconnectedFromPeer(key: string, connectionId: string) {
  return {
    type: DISCONNECTED_FROM_PEER,
    payload: { connectionId }
  };
}

export function connectingToPeer(key: string) {
  return {
    type: CONNECTING_TO_PEER,
    payload: { key }
  };
}

export function connectedToPeer(key: string) {
  return {
    type: CONNECTED_TO_PEER,
    payload: { key }
  };
}

export function disconnectingFromPeer() {
  return {
    type: DISCONNECTING_FROM_PEER
  };
}

export function someoneConnectedToPeer(clientId: string) {
  return {
    type: SOMEONE_CONNECTED_TO_PEER,
    payload: {
      clientId
    }
  };
}

export function sendMessageToPeer(clientId: string, message: string) {
  return {
    type: SEND_MESSAGE,
    payload: { clientId, message }
  };
}

export function receivedMessage(
  from: string,
  connectionId: string,
  payload: string
) {
  return {
    type: RECEIVED_MESSAGE,
    payload: { from, connectionId, payload }
  };
}


export function connectToPeer(key = '') {
  //const peer = new Peer({ key: '' });
  const peer = new Peer({ key: 'asdasfaeasrz34' });
  return (dispatch: Dispatch) => {
    const conn = peer.connect(key);
    dispatch(connectingToPeer(key));
    conn.on('open', (id: string) => {
      dispatch(connectedToPeer(id));
      conn.on('connection', (dataConnection: DataConnection) => {
        dataConnection.on('data', (data) => {
          try {
            const {
              clientId
            }: { clientId: string } = JSON
              .parse(data)
            connections = connections.set(clientId, dataConnection);
            dispatch(someoneConnectedToPeer(clientId));
          } catch (err) {
            dataConnection.send({ code: 'not_valid', err: err.message })
            return;
          }
        });
      });
    });
  }
}

export function disconnectFromPeer(key: string) {
  return {
    type: DISCONNECT_FROM_PEER,
    payload: { key }
  };
}
