import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes.json';
import MainPage from './views/main/page';
import Settings from './views/settings/page';
import PlayerPool from './views/playerPool/page';
import { useToasts } from 'react-toast-notifications'
import { ConnectedProps, connect } from 'react-redux';
import { ProgramState } from '@root/root/types';

function App(props: Props) {
  const { addToast } = useToasts();
  const [ lastPrintedMessage, setLastPrintedMessage ] = useState(0);
  useEffect(() => {
    props.messages.slice(lastPrintedMessage).forEach(message => {
      addToast(message.message, { appearance: message.type, autoDismiss: true })
    })
    if (props.messages.size != lastPrintedMessage) {
      setLastPrintedMessage(props.messages.size);
    }
  })

  return (
    <Switch>
      <Route path={routes.SETTINGS} component={Settings} />
      <Route path={routes.PLAYER_POOL} component={PlayerPool} />
      <Route path={routes.HOME} component={MainPage} />
    </Switch>
  );
};

function mapStateToProps(state: ProgramState) {
  return {
    messages: state.ui.messages
  };
}


const actionCreators = {
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(App);