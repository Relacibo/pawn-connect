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
import { AppThunk } from '@root/root/types';
import { createError } from '../actions';
import peerjs from '@root/../dev/peerjs';

var peer: Peer | null = null;
var connections: Map<string, DataConnection> = new Map()

export function disconnectedFromPeer(peerId: string) {
  return {
    type: DISCONNECTED_FROM_PEER,
    payload: { peerId }
  };
}

export function createdPeer(peerId: string) {
  return {
    type: CREATED_PEER,
    payload: { peerId }
  };
}

export function receivedDataFromPeer(
  peerId: string,
  data: any
) {
  return {
    type: RECEIVED_DATA_FROM_PEER,
    payload: { peerId, message: data }
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

function onConnection(connection: DataConnection): AppThunk {
  return dispatch => {
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
}

export function connectPeer(wantedId?: string): AppThunk<Promise<void>> {
  return async dispatch => {
    try {
      await createPeer(wantedId);
    } catch (err) {
      throw err;
    }
    dispatch(createdPeer(peer!.id));
    peer!.on('connection', function (connection: DataConnection) {
      dispatch(onConnection(connection));
    });
  };
}

async function createPeer(wantedId?: string): Promise<Peer> {
  return new Promise((resolve, reject) => {
    peer = wantedId ? new Peer(wantedId) : new Peer();
    let errorHandle = (err: any) => {
      if (peer) {
        peer.destroy();
      }
      peer = null;
      reject(err)
      return;
    };
    peer.on('error', errorHandle)
    peer.on('open', () => {
      peer?.off('error', errorHandle);
      resolve();
    });
  });
}


export function connectToPeer(peerId: string): AppThunk<Promise<void>> {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      if (!peer) {
        try {
          await createPeer();
        } catch (err) {
          dispatch(createError('Peer server problem. Try again later!'))
          reject()
          return;
        }
        if (!peer) {
          reject()
          return;
        }
        dispatch(createdPeer((peer as Peer).id));
      }
      if (connections.has(peerId)) {
        resolve()
        return;
      }
      const connection = peer.connect(peerId, { reliable: true });
      dispatch({
        type: CONNECTING_WITH_PEER,
        payload: { peerId }
      });
      let errorHandle = (err: any) => {
        console.log('could not connect')
        switch (err.type) {
          case 'peer-unavailable': {
            dispatch(createError('Peer not available!'))
            peer!.off('error', errorHandle);
            reject()
            break;
          }
        }
      }
      connection.on('open', () => {
        peer!.off('error', errorHandle);
        dispatch(onConnection(connection));
        resolve()
      });
      peer.on('error', errorHandle)
    });
  }
}

export function disconnectPeer(): AppThunk {
  return dispatch => {
    peer?.destroy();
    connections = new Map();
    dispatch({ type: DELETED_PEER })
    peer = null;
  }
}
