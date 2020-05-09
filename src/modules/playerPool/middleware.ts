import { ThunkMiddleware } from "redux-thunk";
import { Action } from "redux";
import { GetState, Dispatch } from "@root/root/types";
import { RECEIVED_DATA_FROM_PEER } from "../peer/enums/actions";
import { sendPeerMessage } from "./actions";

const middleware: ThunkMiddleware = api => next =>
  (action: Action<string>) => {
    // call reducers first
    const result = next(action);
    const dispatch: Dispatch = api.dispatch;
    const getState: GetState = api.getState as GetState;
    switch (action.type) {
      case RECEIVED_DATA_FROM_PEER: {
        const { data, peerId }:
          { data: PeerMessage, peerId: string } = (action as any).payload;
        switch (data.type) {
          case 'subscribe': {
            const success = getState().playerPool.playerPoolState?.members.has(peerId);
            if (success) {
              dispatch(sendPeerMessage(peerId, {
                type: 'ok'
              }));
            } else {
              dispatch(sendPeerMessage(peerId, {
                type: 'error'
              }));
            }
            break;
          }
          case 'unsubscribe': {

            break;
          }
          default:
            break;
        }
      }
    }
    return result;
  }

export default middleware;
