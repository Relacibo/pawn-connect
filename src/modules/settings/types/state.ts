/* eslint-disable @typescript-eslint/no-explicit-any */
import { Map } from 'immutable';

export default class State {
  constructor(readonly config: Map<string, any> = Map()) {}
}
