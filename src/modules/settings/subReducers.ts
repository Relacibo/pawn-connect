/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { Map } from 'immutable';
import { SETTINGS_UI_STORE_VALUE } from './enums/actions';

export function config(
  state: Map<string, any> = Map(),
  action: Action<string>
) {
  switch (action.type) {
    case SETTINGS_UI_STORE_VALUE: {
      const { key, value } = (action as any).payload;
      return state.set(key, value);
    }
    default:
      return state;
  }
}
