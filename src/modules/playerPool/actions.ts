import { AppThunk } from "@root/root/types";
import { SWITCH_VIEW } from "./enums/actions";
import { HOST_PLAYER_POOL_FORM, CONNECT_TO_PLAYER_POOL_FORM } from "./enums/views";
import { routerActions } from "connected-react-router";
import { sendDataOverPeer } from "../peer/actions";

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
  return (dispatch, getState) => {
    if (getState().playerPool.conditionsMet) {
      dispatch(routerActions.replace('/'));
      return;
    }
    dispatch({
      type: SWITCH_VIEW,
      payload: {
        viewId: HOST_PLAYER_POOL_FORM
      }
    })
  }
}

export function connectToPlayer(): AppThunk {
  return (dispatch, getState) => {
    if (getState().playerPool.conditionsMet) {
      dispatch(routerActions.replace('/'));
      return;
    }
    dispatch({
      type: SWITCH_VIEW,
      payload: {
        viewId: CONNECT_TO_PLAYER_POOL_FORM
      }
    })
  }
}
