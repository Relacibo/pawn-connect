import * as React from 'react';
import { render } from 'react-dom';
import Root from './root/RootView';
import { configureStore, history } from './store/configureStore';
import './views/app.global.css';
import { initialize } from './modules/initialize/actions';
import { Dispatch } from './root/types';
import * as ls from 'local-storage';

if (location.pathname.startsWith('/api')) {
  const { params } = (window as any);
  if (params) {
    ls.set<any>('params', params);
  }
  location.replace('/');
} else {
  bootstrapApp();
}
function bootstrapApp() {
  const store = configureStore();
  const dispatch = store.dispatch as Dispatch;

  dispatch(initialize());
  const AppContainer = React.Fragment;
  document.addEventListener('DOMContentLoaded', () =>
    render(
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    )
  );
}
