/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppThunk } from '@root/root/types';
import { initializeLichess } from '@modules/lichess/actions';

export function initialize(params: any): AppThunk {
  return dispatch => {
    dispatch(initializeLichess(params.lichess));
  };
}
