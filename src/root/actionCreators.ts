import { routerActions } from 'connected-react-router';
import * as settingsActions from '../modules/settings/actions';
import * as peerActions from '../modules/peer/actions';

const actionCreators = {
  ...routerActions,
  ...settingsActions,
  ...peerActions
};

export default actionCreators;
