/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppThunk } from '@root/root/types';
import { initializeLichess } from '@modules/lichess/actions';
import { get, remove } from 'local-storage';
import { initializePeer } from '../peer/actions';

export function initialize(): AppThunk {
  return dispatch => {
    let input = get<string>('input');
    var params: any = {};
    if (input) {
      try {
        params = JSON.parse(input);
      } catch (err) {
        console.log(err);
      }
    }
    const { lichess } = params;
    dispatch(initializeLichess(lichess));
    dispatch(initializePeer())
    remove('input');
  };
}
