/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { SETTINGS_UI_STORE_VALUE } from './enums/actions';

export function settingsStoreValue(payload: { key: string; value: any }) {
  return {
    type: SETTINGS_UI_STORE_VALUE,
    payload
  };
}
