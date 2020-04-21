import * as React from 'react';
import { render } from 'react-dom';
import Root from './root/RootView';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { initialize } from './modules/initialize/actions';
import { Dispatch } from './root/types';

const store = configureStore();

const AppContainer = React.Fragment;
const dispatch = store.dispatch as Dispatch;

(window as any).initialize = (params: any) => dispatch(initialize(params));

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);

