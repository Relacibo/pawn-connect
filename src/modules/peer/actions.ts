import Peer, { DataConnection } from 'peerjs';
import {
  DISCONNECTED_FROM_PEER,
  CONNECTING_WITH_PEER,
  CONNECTED_WITH_PEER,
  RECEIVED_MESSAGE,
  SEND_MESSAGE,
  CREATED_PEER,
  DELETED_PEER
} from './enums/actions';
import { AppThunk, Dispatch } from '@root/root/types';

var peer: Peer | null = null;
var connections: Map<string, DataConnection> = new Map()

export function disconnectedFromPeer(peerId: string) {
  return {
    type: DISCONNECTED_FROM_PEER,
    payload: { peerId }
  };
}

export function receivedMessage(
  from: string,
  payload: string
) {
  return {
    type: RECEIVED_MESSAGE,
    payload: { from, payload }
  };
}

export function sendMessageToPeer(peerId: string, message: string): AppThunk {
  return dispatch => {
    const connection = connections.get(peerId);
    if (!connection) {
      return;
    }
    connection.send(message);
    dispatch({
      type: SEND_MESSAGE,
      payload: { peerId, message }
    })
  };
}

function onConnection(connection: DataConnection, dispatch: Dispatch) {
  const { peer: peerId } = connection;
  connections.set(peerId, connection);
  dispatch({
    type: CONNECTED_WITH_PEER,
    payload: { peerId }
  });
  connection.on('data', (message: string) => {
    dispatch(receivedMessage(peerId, message));
  });
  connection.on('close', () => {
    dispatch(disconnectedFromPeer(peerId))
  });
}

export function initializePeer(): AppThunk {
  return dispatch => {
    peer = new Peer();
    peer.on('open', (id) => {
      dispatch({
        type: CREATED_PEER,
        payload: { peerId: id }
      });
    })
    peer.on('connection', function (connection: DataConnection) {
      onConnection(connection, dispatch);
    });
  }
}

export function disconnectPeer(): AppThunk {
  return dispatch => {
    peer?.disconnect();
    dispatch({ type: DELETED_PEER })
  }
}


export function connectToPeer(peerId: string): AppThunk {
  return dispatch => {
    if (!peer) {
      return;
    }
    const connection = peer.connect(peerId, { reliable: true });
    dispatch({
      type: CONNECTING_WITH_PEER,
      payload: { peerId }
    });
    connection.on('open', () => {
      onConnection(connection, dispatch);
    });
  };

}

export function disconnectFromPeer(peerId: string): AppThunk {
  return dispatch => {
    if (!peer) {
      return;
    }
    const connection = connections.get(peerId);
    if (!connection)
      return;
    connection.close();
    connections.delete(peerId);
    dispatch({
      type: DISCONNECTED_FROM_PEER,
      payload: { peerId }
    });
  };
}
