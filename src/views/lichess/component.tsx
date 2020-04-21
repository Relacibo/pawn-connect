/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ProgramState } from '@root/root/types';
import {loginToLichess, logoutFromLichess} from '@modules/lichess/actions';
import { LOGGED_IN } from '@root/modules/lichess/enums/loginState';

const LichessLogin = (props: Props) => {
  return (<div>
      { props.lichessLoginUsername ? (
        <button onClick={props.logoutFromLichess}>{props.lichessLoginUsername}</button>
      ) : (
        <button onClick={props.loginToLichess}>Login</button>
      ) }
      </div>);
};

function mapStateToProps(state: ProgramState) {
  const { oauth, loginState } = state.lichess;
  const username = loginState == LOGGED_IN && oauth ? oauth.username : '';
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
export default connector(LichessLogin);
