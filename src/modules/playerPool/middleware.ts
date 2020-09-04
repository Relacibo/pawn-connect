import { ThunkMiddleware } from "redux-thunk";
import { Action } from "redux";
import { GetState, Dispatch } from "@root/root/types";
import { RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { sendPeerMessage, updateClients } from "./actions";
import { RECEIVED_SUBSCRIBE_REQUEST, RECEIVED_UNSUBSCRIBE_REQUEST, RECEIVED_MEMBERS_UPDATE, RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND, PLAYER_POOL_SUBSCRIPTION_SUCCESS } from "./enums/actions";
import { sendChallenge } from "../lichess/actions";

const middleware: ThunkMiddleware = api => next =>
  (action: Action<string>) => {
    // call reducers first
    let result = null;
    const dispatch: Dispatch = api.dispatch;
    const getState: GetState = api.getState as GetState;
    switch (action.type) {
      // Action from peerjs-module.
      case RECEIVED_DATA_FROM_PEER: {
        const { data, peerId }:
          { data: PeerMessage, peerId: string } = (action as any).payload;
        const playerPoolState = getState().playerPool.playerPoolState;
        const isHost = playerPoolState.type != 'disconnected' && playerPoolState.host.isHost;
        const isFromHost = playerPoolState.type != 'disconnected' && !playerPoolState.host.isHost && playerPoolState.host.peerId == peerId;
        switch (data.type) {
          case 'ok': {
            const { answerTo } = data;
            switch (answerTo) {
              case 'subscribe': {
                if (isHost || playerPoolState.type != 'connecting') {
                  dispatch({ type: PLAYER_POOL_SUBSCRIPTION_SUCCESS, payload: {

                  }})
                  return next(action);
                }
              }
            }
            return next(action);
          }
          case 'subscribe': {
            if (!isHost || playerPoolState.type != 'connected') {
              return next(action);
            }
            const { lichessId } = data;
            if (lichessId) {
              dispatch({
                type: RECEIVED_SUBSCRIBE_REQUEST,
                payload: { lichessId, peerId }
              })
            }
            result = next(action);
            const success = playerPoolState.members.has(peerId);
            if (success) {
              dispatch(updateClients());
              dispatch(sendPeerMessage(peerId, {
                type: 'ok',
                answerTo: 'subscribe'
              }));
            } else {
              dispatch(sendPeerMessage(peerId, {
                type: 'error',
                answerTo: 'subscribe'
              }));
            }
            break;
          }
          case 'unsubscribe': {
            if (playerPoolState.type != 'connected' || !isHost) {
              return next(action);
            }
            dispatch({
              type: RECEIVED_UNSUBSCRIBE_REQUEST,
              payload: { peerId }
            })
            result = next(action);
            const success = !playerPoolState.members.has(peerId);
            if (success) {
              dispatch(updateClients())
              dispatch(sendPeerMessage(peerId, {
                type: 'ok',
                answerTo: 'unsubscribe'
              }));
            } else {
              dispatch(sendPeerMessage(peerId, {
                type: 'error',
                answerTo: 'unsubscribe'
              }));
            }
            break;
          }
          case 'update_members': {
            if (!isFromHost) {
              return next(action);
            }
            const { peerIds, lichessIds } = data;
            dispatch({
              type: RECEIVED_MEMBERS_UPDATE,
              payload: {
                peerId,
                peerIds,
                lichessIds
              }
            })
            return next(action);
          }
          case 'challenge': {
            if (!isFromHost) {
              break;
            }
            const { lichessId, params } = data;
            // send lichess challenge
            dispatch(sendChallenge(lichessId, params))
            return next(action);
          }
          case 'accept_challenge': {
            if (!isFromHost) {
              break;
            }
            const { lichessId } = data;
            dispatch({
              type: RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND,
              payload: { lichessId }
            })
            return next(action);
          }
          default:
            return next(action);
        }
        break;
      }
      default: {
        return next(action);
      }
    }
    return result!;
  }

export default middleware;
