/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppThunk } from '@root/root/types';
import { initializeLichess } from '@modules/lichess/actions';
import { history } from '@root/store/configureStore'

export function initialize(params: any): AppThunk {
  return dispatch => {
    const { lichess } = params;

    if (lichess) {
      history.replace({
        pathname: '/',
        search: ''
      });
      dispatch(initializeLichess(lichess));
    }
  };
}
