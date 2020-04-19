import { DISCONNECTED } from '../enums/connectionState';

export default class ConnectionState {
  constructor(readonly state = DISCONNECTED, readonly connectionId = '') {}
}
