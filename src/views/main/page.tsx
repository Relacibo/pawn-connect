/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import routes from '@root/root/routes.json';
import styles from './style.css';
import { ProgramState } from '../../root/types';
import OAuth from '@modules/lichess/types/OAuth';
import {loginToLichess, logoutFromLichess} from '@modules/lichess/actions';

const Home = (props: Props) => {
  return (
    <div className={styles.container} data-tid="container">
      {props.lichessLoginUsername ? (
        <div onClick={props.logoutFromLichess}>props.lichessLoginUsername</div>
      ) : (
        <div onClick={props.loginToLichess}>Login</div>
      )}
      <h2>Home</h2>
      <div>
        <div>
          <Link to={routes.SETTINGS}>Settings</Link>
        </div>
        <div>
          <Link to={routes.PEER_CONNECTION_TEST}>Peer</Link>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: ProgramState) {
  const oauth: OAuth | null = state.lichess.oauth as (OAuth | null);
  const username = oauth ? oauth.username : '';
  return {
    lichessLoginUsername: username
  };
}

const actionCreators = {
  loginToLichess,
  logoutFromLichess
};

const connector = connect(mapStateToProps, actionCreators);
export type Props = ConnectedProps<typeof connector>;
export default connector(Home);
