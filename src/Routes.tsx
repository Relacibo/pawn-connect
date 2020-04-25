import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes.json';
import App from './root/App';
import MainPage from './views/main/page';
import Settings from './views/settings/page';
import PeerConnectionTest from './views/peerConnectionTest/page';
import Tournament from './views/tournament/page';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SETTINGS} component={Settings} />
        <Route
          path={routes.PEER_CONNECTION_TEST}
          component={PeerConnectionTest}
        />
        <Route path={routes.TOURNAMENT} component={Tournament} />
        <Route path={routes.HOME} component={MainPage} />
      </Switch>
    </App>
  );
}
