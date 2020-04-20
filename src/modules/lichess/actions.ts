/* eslint-disable no-console */
import axios from 'axios';
import { get, set, remove } from 'local-storage';
import {
  GAINED_LICHESS_TOKEN,
  LICHESS_TOKEN_REVOKED,
  LICHESS_LOGIN_ERROR,
  LICHESS_REFRESHED_TOKEN
} from './enums/actions';
import { Dispatch, AppThunk, GetState } from '@root/root/types';
import OAuth from './types/OAuth';

const serverURL = 'http://pawn-connect.org';
const oathAPIPath = '/api/oauth/lichess';
const authorizeUri = `${serverURL}${oathAPIPath}/authorize`;
const refreshUri = `${serverURL}${oathAPIPath}/refresh`;
const lichessBaseURL = 'https://lichess.org';

let refreshTokenObject: NodeJS.Timeout;
const WINDOW_BEFORE_REFRESH = 300000;
const WAIT_AFTER_REFRESH_FAIL = 30000;
let refreshFailCount = 0;

export function lichessTokenRevoked() {
  return {
    type: LICHESS_TOKEN_REVOKED
  };
}

export function lichessLoginError(message: string) {
  return {
    type: LICHESS_LOGIN_ERROR,
    payload: { message }
  };
}

export function loginToLichess() {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(authorizeUri);
      const body = response.data;
      const { authorizationUri } = JSON.parse(body);
      window.location.href = authorizationUri;
    } catch (err) {
      console.log(err);
      dispatch(
        lichessLoginError(
          'Failed to login to lichess! Try again in one minute!'
        )
      );
    }
  };
}

export function logoutFromLichess(): AppThunk {
  return async (dispatch: Dispatch, getState: GetState) => {
    remove('lichess_username');
    remove('lichess_accessToken');
    remove('lichess_refreshToken');
    remove('lichess_expireTimeStamp');
    clearTimeout(refreshTokenObject);
    const oauth = getState().lichess.oauth as OAuth;
    dispatch({
      type: LICHESS_TOKEN_REVOKED
    });
  };
}

function refreshOAuth(): AppThunk {
  return async (dispatch, getState) => {
    const { refreshToken } = getState().lichess.oauth as OAuth;
    try {
      const response = await axios({
        method: 'post',
        url: refreshUri,
        data: { refresh_token: refreshToken }
      });
      const currentTime = new Date().getTime();
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { expires_in } = JSON.parse(response.data);
      const expireTimeStamp: number = currentTime + parseInt(expires_in, 10);
      set<number>('lichess_expireTimeStamp', expireTimeStamp);
      dispatch({
        type: LICHESS_REFRESHED_TOKEN,
        payload: { expireTimeStamp }
      });
      const nextRefresh = expireTimeStamp - currentTime - WINDOW_BEFORE_REFRESH;
      refreshFailCount = 0;
      refreshTokenObject = setTimeout(
        () => dispatch(refreshOAuth()),
        nextRefresh
      );
    } catch (err) {
      if (refreshFailCount === 4) {
        dispatch(logoutFromLichess());
      }
      console.log(err);
      refreshFailCount += 1;
      refreshTokenObject = setTimeout(
        () => dispatch(refreshOAuth()),
        WAIT_AFTER_REFRESH_FAIL
      );
    }
  };
}

async function authorizedLichessAPICall(
  path: string,
  method: 'post' | 'get',
  accessToken: string
) {
  const response = await axios(path, {
    method,
    baseURL: lichessBaseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initializeLichess(params: any): AppThunk {
  return async (dispatch, getState) => {
    let oauth: OAuth | null = null;
    const currentTime = new Date().getTime();
    if (params) {
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn
      }: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
      } = params;
      try {
        const response = await authorizedLichessAPICall(
          '/api/account',
          'get',
          accessToken
        );
        const { username } = JSON.parse(response.data);
        const expireTimeStamp = currentTime + expiresIn;

        set<string>('lichess_username', username);
        set<string>('lichess_accessToken', accessToken);
        set<string>('lichess_refreshToken', refreshToken);
        set<number>('lichess_expireTimeStamp', expireTimeStamp);
        oauth = new OAuth(username, accessToken, refreshToken, expireTimeStamp);
      } catch (err) {
        console.log(err);
      }
    } else {
      const username = get<string>('lichess_username');
      const timestamp = get<number>('lichess_expireTimeStamp');
      if (username && currentTime < timestamp) {
        oauth = new OAuth(
          username,
          get<string>('lichess_accessToken'),
          get<string>('lichess_refreshToken'),
          timestamp
        );
      }
    }
    if (oauth) {
      const nextRefresh =
        oauth.expireTimeStamp - currentTime - WINDOW_BEFORE_REFRESH;
      refreshTokenObject = setTimeout(
        () => dispatch(refreshOAuth()),
        nextRefresh
      );
      dispatch({
        type: GAINED_LICHESS_TOKEN,
        payload: oauth
      });
    }
  };
}
