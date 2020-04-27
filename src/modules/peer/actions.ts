import Peer, { DataConnection } from 'peerjs';
import {
  DISCONNECTED_FROM_PEER,
  CONNECTING_WITH_PEER,
  CONNECTED_WITH_PEER,
  RECEIVED_DATA_FROM_PEER,
  SEND_DATA_OVER_PEER,
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

export function receivedDataFromPeer(
  from: string,
  data: any
) {
  return {
    type: RECEIVED_DATA_FROM_PEER,
    payload: { from, payload: data }
  };
}

export function sendDataOverPeer(peerId: string, data: any): AppThunk {
  return dispatch => {
    connections.get(peerId)?.send(data);
    dispatch({
      type: SEND_DATA_OVER_PEER,
      payload: { peerId, message: data }
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
    dispatch(receivedDataFromPeer(peerId, message));
  });
  connection.on('close', () => {
    dispatch(disconnectedFromPeer(peerId))
  });
}

export function connectPeer(wantedId?: string): AppThunk {
  return dispatch => {
    peer = wantedId ? new Peer(wantedId) : new Peer();
    peer.on('open', (peerId) => {
      dispatch({
        type: CREATED_PEER,
        payload: { peerId }
      });
    })
    peer.on('connection', function (connection: DataConnection) {
      onConnection(connection, dispatch);
    });
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

export function disconnectPeer(): AppThunk {
  return dispatch => {
    peer?.destroy();
    connections = new Map();
    dispatch({ type: DELETED_PEER })
  }
}
