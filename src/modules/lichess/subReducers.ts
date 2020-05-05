/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import OAuth from './types/OAuth';
import {
  GAINED_LICHESS_TOKEN,
  LICHESS_TOKEN_REVOKED,
  LICHESS_REFRESHED_TOKEN,
  LICHESS_LOGGING_IN,
  LICHESS_LOGIN_ERROR
} from './enums/actions';
import { LOGGED_OUT, LOGGING_IN, LOGGED_IN } from './enums/loginState';

function expireTimeStamp(state: number, action: Action<string>) {
  switch (action.type) {
    case LICHESS_REFRESHED_TOKEN:

    default:
      return state;
  }
}

export function oauth(state: OAuth | null = null, action: Action<string>): OAuth | null {
  switch (action.type) {
    case GAINED_LICHESS_TOKEN:
      return { ...state, ...(action as any).payload } as OAuth;
    case LICHESS_TOKEN_REVOKED:
      return null;
    case LICHESS_REFRESHED_TOKEN:
      if (state == null)
        return null;
      return {
        ...state,
        expireTimeStamp: expireTimeStamp(state.expireTimeStamp, action)
      } as OAuth;
    default:
      return state;
  }
}

export function loginState(state: number = LOGGED_OUT, action: Action<string>) {
  switch (action.type) {
    case LICHESS_LOGGING_IN:
      return LOGGING_IN;
    case GAINED_LICHESS_TOKEN:
      return LOGGED_IN;
    case LICHESS_TOKEN_REVOKED:
      return LOGGED_OUT;
    case LICHESS_LOGIN_ERROR:
      return LOGGED_OUT;
    default: return state;
  }
}
