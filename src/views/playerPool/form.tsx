import React from 'react';
import styles from './css/playerPool.css'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import routes from './routes.json';
import JoinForm from './joinForm';
import HostComponent from './hostComponent';
import { hostPlayerPool } from '@modules/playerPool/actions';
import { connect, ConnectedProps } from 'react-redux';

const form = (props: Props) => {
  let match = useRouteMatch();
  return (
    <div className={styles['button-group']}>
      <Switch>
        <Route path={`${match.path}${routes.HOST}`} component={HostComponent} />
        <Route path={`${match.path}${routes.JOIN}`} component={JoinForm} />
        <Route path={match.path}>
          <Link to={`${match.url}${routes.JOIN}`} className={styles.button}>
            Join player pool
            </Link>
          <div className={styles.button} onClick={props.hostPlayerPool}>
            Host player pool
          </div>
        </Route>
      </Switch>
    </div>
  );
}

const actionCreators = {
  hostPlayerPool
};

let connected = connect(null, actionCreators);

type Props = ConnectedProps<typeof connected>;

export default connected(form);

