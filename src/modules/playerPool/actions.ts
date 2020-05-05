import { AppThunk } from "@root/root/types";
import { sendDataOverPeer, connectPeer, disconnectPeer, connectToPeer } from "../peer/actions";
import * as Util from "@root/util/util";

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
  }
}

export function connectToPlayer(lichessId: string): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().lichess.oauth) {
      return;
    }
    try {
      await dispatch(connectToPeer(Util.getPeerIDFromLichessID(lichessId)));
    } catch (err) {
      throw err;
    }
    let peerId = getState().playerPool.playerPoolState?.members.findKey(
      playerState => playerState.lichessId == lichessId
    );
    let myLichessId = getState().lichess.oauth?.username;
    dispatch(sendPeerMessage(peerId!, {
      type: 'subscribe',
      lichessId: myLichessId!
    }))
  }
}
