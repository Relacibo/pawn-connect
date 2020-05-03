import React from 'react';
import styles from './css/playerPool.css'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import routes from './routes.json';
import HostForm from './hostForm';
import JoinForm from './joinForm';

const form = () => {
  let match = useRouteMatch();
  return (
    <div className={styles['button-group']}>
      <Switch>
        <Route path={`${match.path}${routes.HOST}`} component={HostForm} />
        <Route path={`${match.path}${routes.JOIN}`} component={JoinForm} />
        <Route path={match.path}>
          <Link to={`${match.url}${routes.JOIN}`} className={styles.button}>Join player pool</Link>
          <Link to={`${match.url}${routes.HOST}`} className={styles.button}>Host player pool</Link>
        </Route>
      </Switch>
    </div>
  );
}

export default form;
