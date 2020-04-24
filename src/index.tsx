import * as React from 'react';
import { render } from 'react-dom';
import Root from './root/RootView';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { initialize } from './modules/initialize/actions';
import { Dispatch } from './root/types';
import { set } from 'local-storage';

if ((window as any).copyToMemory) {
  (window as any).initialize = (params: any) => {
    let input = JSON.stringify(params);
    set<string>('input', input);
    location.replace('/');
  }
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
