import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { configureStore, history } from './store/configureStore';
import './views/app.global.css';
import { initialize } from './modules/initialize/actions';
import { Dispatch } from './root/types';
import * as ls from 'local-storage';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from './Routes';

const store = configureStore();
const dispatch = store.dispatch as Dispatch;
dispatch(initialize());
document.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />{}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
});

