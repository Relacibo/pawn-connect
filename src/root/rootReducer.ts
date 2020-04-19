import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import settings from '../modules/settings/reducer';
import peer from '../modules/peer/reducer';
import lichess from '../modules/lichess/reducer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    settings,
    lichess,
    peer
  });
}
