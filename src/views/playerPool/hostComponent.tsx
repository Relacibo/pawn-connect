import { connect, ConnectedProps } from "react-redux";
import { Redirect } from 'react-router-dom'
import React from "react";
import { hostPlayerPool } from '@modules/playerPool/actions';
import routes from '@root/routes.json'

const HostComponent = (props: Props) => {
  props.hostPlayerPool();
  return (<Redirect to={routes.PLAYER_POOL} />);
}

const actionCreators = {
  hostPlayerPool
};

let connected = connect(null, actionCreators);

type Props = ConnectedProps<typeof connected>;

export default connected(HostComponent);
