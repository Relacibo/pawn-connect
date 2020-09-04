import { AppThunk } from "@root/root/types";
import { sendDataOverPeer, connectPeer, disconnectPeer, connectToPeer } from "../peer/actions";
import * as Util from "@root/util/util";
import { DELETE_PLAYER_POOL, CREATE_PLAYER_POOL, CONNECTING_TO_PLAYER_POOL } from "./enums/actions";
import { createError, createSuccess } from "../actions";

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
      throw err;
    }
    dispatch({ type: CREATE_PLAYER_POOL })
  }
}

export function connectToPlayer(lichessId: string): AppThunk {
  return async (dispatch, getState) => {
    const oauth = getState().lichess.oauth
    if (!oauth || lichessId == oauth.username) {
      dispatch(createError('You cannot use your own lichess username!'))
      return;
    }
    const hostPeerId = Util.getPeerIDFromLichessID(lichessId);
    try {
      await dispatch(connectToPeer(hostPeerId));
      dispatch(createSuccess('Connected to peer!'))
    } catch (err) {
      dispatch(createError('Could not connect to player!'))
    }
    dispatch({
      type: CONNECTING_TO_PLAYER_POOL,
      payload: {
        peerId: hostPeerId
      }
    })
    const myLichessId = oauth.username;
    dispatch(sendPeerMessage(hostPeerId, {
      type: 'subscribe',
      lichessId: myLichessId
    }))
  }
}

export function disconnectFromPlayerPool(): AppThunk {
  return async (dispatch, getState) => {
    const playerPoolState = getState().playerPool.playerPoolState;
    if (playerPoolState.type == 'connected' && playerPoolState.host.isHost) {
      dispatch({ type: DELETE_PLAYER_POOL })
    } else if (playerPoolState.type != 'disconnected' && !playerPoolState.host.isHost) {
      dispatch(sendPeerMessage(playerPoolState.host.peerId, {
        type: 'unsubscribe'
      }))
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
    const lichessIds = playerPoolState.members.keySeq().toArray()
    const peerIds = playerPoolState.members.valueSeq().map(p => p.peerId).toArray()
    peerIds.forEach(p => {
      dispatch(sendPeerMessage(p, {
        type: 'update_members',
        peerIds,
        lichessIds
      }));
    });
  }
}
