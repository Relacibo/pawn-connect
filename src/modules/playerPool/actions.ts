import { AppThunk } from "@root/root/types";
import { sendDataOverPeer, connectPeer, disconnectPeer, connectToPeer } from "../peer/actions";
import * as Util from "@root/util/util";
import { DELETE_PLAYER_POOL, CREATE_PLAYER_POOL, CONNECTING_TO_PLAYER_POOL } from "./enums/actions";

export function initialize(params: any): AppThunk {
  return dispatch => {
    const { query } = params;
    let hostId = null;
    if (query) {
      const { hostid: _hostid } = query;
      hostId = _hostid;
    }
  }
}

export function sendPeerMessage(peerId: string, message: PeerMessage): AppThunk {
  return dispatch => dispatch(sendDataOverPeer(peerId, message));
}

export function hostPlayerPool(): AppThunk {
  return async (dispatch, getState) => {
    let state = getState();
    if (!state.lichess.oauth) {
      return;
    }
    if (state.peer.connection) {
      await dispatch(disconnectPeer());
    }
    let lichessId = state.lichess.oauth.username;
    try {
      await dispatch(connectPeer(Util.getPeerIDFromLichessID(lichessId)));
    } catch (err) {
      console.log(err);
      throw err;
    }
    dispatch({ type: CREATE_PLAYER_POOL })
  }
}

export function connectToPlayer(lichessId: string): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().lichess.oauth) {
      return;
    }
    const hostPeerId = Util.getPeerIDFromLichessID(lichessId);
    try {
      await dispatch(connectToPeer(hostPeerId));
    } catch (err) {
      throw err;
    }
    let myLichessId = getState().lichess.oauth!.username;
    dispatch({
      type: CONNECTING_TO_PLAYER_POOL,
      payload: {
        peerId: hostPeerId
      }
    })
    dispatch(sendPeerMessage(hostPeerId!, {
      type: 'subscribe',
      lichessId: myLichessId!
    }))
  }
}

export function disconnectFromPlayerPool(): AppThunk {
  return (dispatch, getState) => {
    const playerPoolState = getState().playerPool.playerPoolState;
    if (playerPoolState.type == 'connected' && playerPoolState.host.isHost) {
      dispatch({ type: DELETE_PLAYER_POOL })
    } else if (playerPoolState.type != 'disconnected') {
      dispatch(disconnectPeer())
      dispatch({ type: DELETE_PLAYER_POOL })
    }
  }
}

export function updateClients(): AppThunk {
  return async (dispatch, getState) => {
    const playerPoolState = getState().playerPool.playerPoolState;
    if (!playerPoolState || playerPoolState.type != 'connected') {
      return;
    }
    const peerIds = playerPoolState.members.keySeq().toArray()
    const lichessIds = playerPoolState.members.valueSeq().map(p => p.lichessId).toArray()
    peerIds.forEach(p => {
      dispatch(sendPeerMessage(p, {
        type: 'update_members',
        peerIds,
        lichessIds
      }));
    });
  }
}
