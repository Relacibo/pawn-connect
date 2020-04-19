/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import OAuth from './types/OAuth';
import {
  GAINED_LICHESS_TOKEN,
  LICHESS_TOKEN_REVOKED,
  LICHESS_REFRESHED_TOKEN
} from './enums/actions';

function expireTimeStamp(state: number, action: Action<string>) {
  switch (action.type) {
    case LICHESS_REFRESHED_TOKEN:

    default:
      return state;
  }
}

export function oauth(state: OAuth, action: Action<string>) {
  switch (action.type) {
    case GAINED_LICHESS_TOKEN:
      return { ...state, ...(action as any).payload } as OAuth;
    case LICHESS_TOKEN_REVOKED:
      return null;
    case LICHESS_REFRESHED_TOKEN:
      return {
        ...state,
        expireTimeStamp: expireTimeStamp(state.expireTimeStamp, action)
      };
    default:
      return state;
  }
}
