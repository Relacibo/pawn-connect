/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ProgramState } from '@root/root/types';
import { loginToLichess, logoutFromLichess } from '@modules/lichess/actions';
import { LOGGED_IN, LOGGING_IN } from '@root/modules/lichess/enums/loginState';
import lichess from './css/lichess.css'

const LichessLogin = (props: Props) => {
  return props.loginState == LOGGED_IN ? (
    <span className={lichess["login-container"]}>
      <span className={lichess["icon-lichess"]}> {props.username}</span>
      <div className={lichess["login-button"]} onClick={props.logoutFromLichess}>logout</div>
    </span>
  ) : props.loginState == LOGGING_IN ? (
    <span className={lichess["login-container"]}>
      <span className={`${lichess["icon-lichess"]} ${lichess["lichess-spinner"]}`}></span>
    </span>
  ) : (
        <span className={lichess["login-container"]}>
          <div className={lichess["login-button"]} onClick={props.loginToLichess}><span className={lichess["icon-lichess"]}>login</span></div>
        </span >
      );
};

function mapStateToProps(state: ProgramState) {
  const { oauth, loginState } = state.lichess;
  const username = loginState == LOGGED_IN && oauth ? oauth.username : '';
  return {
    loginState,
    username
  };
}

const actionCreators = {
  loginToLichess,
  logoutFromLichess
};

const connector = connect(mapStateToProps, actionCreators);
export type Props = ConnectedProps<typeof connector>;
export default connector(LichessLogin);
