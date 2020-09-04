import React from 'react';
import { render } from 'react-dom';
import { configureStore, history } from './store/configureStore';
import './views/app.global.css';
import { get, remove } from 'local-storage';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import { initialize as initializeLichess } from './modules/lichess/actions';
import { Dispatch } from './root/types';
import { ToastProvider } from 'react-toast-notifications';

const store = configureStore();
const dispatch: Dispatch = store.dispatch;
// Initialize from params
var params = get<any>('params');
params = params || {};
const { lichessOAuth } = params;
dispatch(initializeLichess(lichessOAuth))
remove('params');
document.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ToastProvider>
          <App />{}
        </ToastProvider>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
});

