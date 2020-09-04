import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes.json';
import MainPage from './views/main/page';
import Settings from './views/settings/page';
import PlayerPool from './views/playerPool/page';
import App from './root/App';

function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SETTINGS} component={Settings} />
        <Route path={routes.PLAYER_POOL} component={PlayerPool} />
        <Route path={routes.HOME} component={MainPage} />
      </Switch>
    </App>
  );
};

export default Routes;