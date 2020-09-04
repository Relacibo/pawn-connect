/* eslint-disable no-console */
import axios from 'axios';
import { get, set, remove } from 'local-storage';
import {
  GAINED_LICHESS_CREDENTIALS,
  LICHESS_CREDENTIALS_REVOKED,
  LICHESS_LOGGING_IN,
  LICHESS_EVENT_CHALLENGE,
  LICHESS_EVENT_GAME_START,
  LICHESS_EVENT_GAME_FINISH,
  SENT_LICHESS_CHALLENGE
} from './enums/actions';
import { Dispatch, AppThunk } from '@root/root/types';
import { createError } from '@modules/actions'
import OAuth from './types/OAuth';
import { authorizedLichessAPICall } from './util';

const serverURL = process.env.SERVER_URL || '';
const port = Number(process.env.SERVER_PORT || 443);
const portString = port == 80 || port == 443 ? '' : `:${port.toString()}`;
const oathAPIPath = '/api/oauth/lichess';
const authorizeUri = `${serverURL}${portString}${oathAPIPath}/authorize`;
const lichessBaseURL = 'https://lichess.org';

let refreshTokenObject: NodeJS.Timeout;

/*
const refreshUri = `${serverURL}${portString}${oathAPIPath}/refresh`;
const revokeUri = `${serverURL}${portString}${oathAPIPath}/revoke`;
const WINDOW_BEFORE_REFRESH = 900000;
const WAIT_AFTER_REFRESH_FAIL = 90000;
let refreshFailCount = 0;
const MAX_REFRESH_FAIL_COUNT = 9;*/

var eventStream: ReadableStream | null = null;

export function lichessTokenRevoked() {
  return {
    type: LICHESS_CREDENTIALS_REVOKED
  };
}

export function loginToLichess() {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(authorizeUri);
      const { authorizationUri } = response.data;
      window.location.href = authorizationUri;
    } catch (err) {
      console.log(err);
      dispatch(
        createError(
          'Failed to login to lichess! Try again in one minute!'
        )
      );
    }
  };
}

export function logoutFromLichess(): AppThunk {
  return async dispatch => {
    remove('lichess_state')
    clearTimeout(refreshTokenObject);
    if (eventStream) {
      eventStream.cancel();
      eventStream = null;
    }
    dispatch({
      type: LICHESS_CREDENTIALS_REVOKED
    });
  };
}

/*function refreshOAuth(): AppThunk {
  return async (dispatch, getState) => {
    if (getState().lichess.oauth) {
      return;
    }
    const { refreshToken } = getState().lichess.oauth!;
    try {
      const response = await axios({
        method: 'post',
        url: refreshUri,
        data: { refresh_token: refreshToken },
      });
      const currentTime = new Date().getTime();
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { expires_in: expiresIn } = response.data;
      const expireTimeStamp: number = currentTime + parseInt(expiresIn, 10) * 1000;
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
      if (refreshFailCount >= MAX_REFRESH_FAIL_COUNT) {
        dispatch(logoutFromLichess());
        return;
      }
      console.log(err);
      refreshFailCount += 1;
      refreshTokenObject = setTimeout(
        () => dispatch(refreshOAuth()),
        WAIT_AFTER_REFRESH_FAIL
      );
    }
  };
}*/

// Ignore expireTimestamp, since it doesn't have any impact
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initialize(params?: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}): AppThunk {
  return async (dispatch,getState) => {
    let oauth: OAuth | null = null;
    const currentTime = new Date().getTime();
    if (params) {
      dispatch({
        type: LICHESS_LOGGING_IN
      });
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn
      } = params;
      try {
        const response = await authorizedLichessAPICall(
          '/api/account',
          'get',
          accessToken
        );
        const { username } = response.data;
        const expireTimeStamp = currentTime + expiresIn * 1000;
        oauth = new OAuth(username, accessToken, refreshToken, expireTimeStamp);
        set('lichess_state', oauth)
        dispatch({
          type: GAINED_LICHESS_CREDENTIALS,
          payload: oauth
        });
      } catch (err) {
        console.log(err);
        dispatch(logoutFromLichess());
        dispatch(
          createError(
            'OAuth Token invalid!'
          )
        );
      }
    } else {
      let oauth = getState().lichess.oauth
      if (oauth) {
        let { username, accessToken } = oauth;
        let validAccessToken = false;
        if (accessToken) {
          try {
            const response = await authorizedLichessAPICall(
              '/api/account',
              'get',
              accessToken
            );
            let responseUsername = response.data.username;
            validAccessToken = true;
            if (username != responseUsername) {
              oauth = { ...oauth, username: responseUsername }
              set('lichess_state', oauth)
            }
            dispatch({
              type: GAINED_LICHESS_CREDENTIALS,
              payload: oauth
            });
          } catch { }
        }
        if (!validAccessToken /*&& currentTime < timestamp*/) {
          remove('lichess_state');
          oauth = null;
          dispatch({
            type: LICHESS_CREDENTIALS_REVOKED
          });
        }
      }
    }
    if (oauth) {
      /*const nextRefresh =
        oauth.expireTimeStamp - currentTime - WINDOW_BEFORE_REFRESH;
      refreshTokenObject = setTimeout(
        () => dispatch(refreshOAuth()),
        nextRefresh
      );*/
      dispatch(connectToEventStream());
    }
  };
}

export function connectToEventStream(): AppThunk {
  return async (dispatch, getState) => {
    const lichessState = getState().lichess
    if (!lichessState.oauth) {
      return;
    }
    const { accessToken } = getState().lichess.oauth!;
    try {
      const ndjsonStream = require('can-ndjson-stream');

      fetch(`${lichessBaseURL}/api/stream/event`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })  // make a fetch request to a NDJSON stream service
        .then((response) => {
          return ndjsonStream(response.body); //ndjsonStream parses the response.body

        }).then((stream) => {
          if (eventStream) {
            eventStream.cancel();
          }
          eventStream = stream;
          const reader = stream.getReader();
          let read = (result: any) => {
            if (result.done) {
              return;
            }
            let data = result.value
            switch (data.type) {
              case 'challenge': {
                dispatch({
                  type: LICHESS_EVENT_CHALLENGE,
                  payload: data.challenge
                })
                break;
              }
              case 'gameStart': {
                dispatch({
                  type: LICHESS_EVENT_GAME_START,
                  payload: data.game
                })
                break;
              }
              case 'gameFinish': {
                dispatch({
                  type: LICHESS_EVENT_GAME_FINISH,
                  payload: data.game
                })
                break;
              }
              default: {
                break;
              }
            }
            reader.read().then(read);
          }
          reader.read().then(read);
        });
    } catch {
      dispatch(createError(
        'Lichess event stream disconnected'
      ))
      setTimeout(dispatch(connectToEventStream), 30000)
    }
  }

}

export function sendChallenge(lichessId: string, params: any): AppThunk {
  return async (dispatch, getState) => {
    const lichessState = getState().lichess
    if (!lichessState.oauth) {
      return;
    }
    const { accessToken } = getState().lichess.oauth!;
    const response = await authorizedLichessAPICall(`/api/challenge/${lichessId}`, 'post', accessToken, params);
    dispatch({ type: SENT_LICHESS_CHALLENGE, payload: { params, response } })
  }
}
