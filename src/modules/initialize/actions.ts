/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppThunk } from '@root/root/types';
import { initializeLichess } from '@modules/lichess/actions';
import * as ls from 'local-storage';

export function initialize(): AppThunk {
  return (dispatch, getState) => {
    var params = ls.get<any>('params');
    params = params || {};
    const { lichessOAuth } = params;
    dispatch(initializeLichess(lichessOAuth));
    ls.remove('params');
  };
}
