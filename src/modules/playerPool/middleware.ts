import { ThunkMiddleware } from "redux-thunk";
import { Action } from "redux";
import { GetState, Dispatch } from "@root/root/types";
import { RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { sendPeerMessage, updateClients } from "./actions";
import { RECEIVED_SUBSCRIBE_REQUEST, RECEIVED_UNSUBSCRIBE_REQUEST, RECEIVED_MEMBERS_UPDATE, RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND } from "./enums/actions";
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
        if (!playerPoolState) {
          result = next(action);
          break;
        }
        const host = playerPoolState.host;
        switch (data.type) {
          case 'subscribe': {
            if (!host.isHost) {
              result = next(action);
              break;
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
            } else {
              dispatch(sendPeerMessage(peerId, {
                type: 'error'
              }));
            }
            break;
          }
          case 'unsubscribe': {
            if (!host.isHost) {
              result = next(action);
              break;
            }
            dispatch({
              type: RECEIVED_UNSUBSCRIBE_REQUEST,
              payload: { peerId }
            })
            result = next(action);
            const success = !playerPoolState.members.has(peerId);
            if (success) {
              dispatch(updateClients())
            } else {
              dispatch(sendPeerMessage(peerId, {
                type: 'error'
              }));
            }
            break;
          }
          case 'update_members': {
            if (host.isHost || host.peerId != peerId) {
              result = next(action);
              break;
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
            result = next(action);
            break;
          }
          case 'challenge': {
            result = next(action);
            if (host.isHost || host.peerId != peerId) {
              break;
            }
            const { lichessId } = data;
            // send lichess challenge
            dispatch(sendChallenge(lichessId))
            break;
          }
          case 'accept_challenge': {
            result = next(action);
            if (host.isHost || host.peerId != peerId) {
              break;
            }
            const { lichessId } = data;
            dispatch({
              type: RECEIVED_LICHESS_ACCEPT_CHALLENGE_COMMAND,
              payload: { lichessId }
            })
            break;
          }
          default:
            result = next(action);
            break;
        }
        break;
      }
      default: {
        result = next(action);
        break;
      }
    }
    return result!;
  }

export default middleware;
