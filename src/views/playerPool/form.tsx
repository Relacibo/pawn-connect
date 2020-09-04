import React from 'react';
import styles from './css/playerPool.css'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import routes from './routes.json';
import JoinForm from './joinForm';
import HostComponent from './hostComponent';
import { connect, ConnectedProps } from "react-redux";
import { hostPlayerPool } from '@modules/playerPool/actions';
import { ProgramState } from "@root/root/types";

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
          <button onClick={props.hostPlayerPool} className={styles.button}> 
            Host player pool
          </button>
        </Route>
      </Switch>
    </div>
  );
}

const actionCreators = {
  hostPlayerPool
};

function mapStateToProps(state: ProgramState) {
  return {
    isLoggedIn: state.lichess.oauth != null
  };
}

let connected = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connected>;

export default connected(form)