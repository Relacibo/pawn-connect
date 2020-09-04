import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '@root/root/rootReducer';
import { Store, ProgramState } from '@root/root/types';
import playerPoolMiddleWare from '@modules/playerPool/middleware'

const history = createBrowserHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
let enhancer = applyMiddleware(playerPoolMiddleWare, thunk, router);

function configureStore(initialState?: ProgramState): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
