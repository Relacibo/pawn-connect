import React from 'react';
import PlayerPoolForm from './form';
import styles from './css/playerPool.css';
import Back from '../components/back';
import { ProgramState } from '@root/root/types';
import { ConnectedProps, connect } from 'react-redux';
import { Seq } from 'immutable';
import { disconnectFromPlayerPool } from '@modules/playerPool/actions';

const PlayerPool = (props: Props) => {
  return (
    <div>
      <Back />
      {!props.connected ? (
        <div className={styles['player-pool-form']}><PlayerPoolForm /></div>
      ) : (
          <div><div className={styles.button} onClick={props.disconnectFromPlayerPool}>Disconnect</div>
            <table>
              <thead>
              <tr>
                <th>lichessId</th>
                <th>isConnected</th>
              </tr></thead><tbody>{
                props.members?.map((player) => {
                  return (
                    <tr>
                      <td>{player.lichessId}</td>
                      <td>{player.isConnected}</td>
                    </tr>
                  );
                })
              }</tbody></table></div>
        )}
    </div>
  );
}
function mapStateToProps(state: ProgramState) {
  const playerPoolState = state.playerPool.playerPoolState;
  return {
    connected: playerPoolState.type == 'connected',
    members: (playerPoolState.type == 'connected') ? playerPoolState.members.valueSeq().map(
      player => {
        return {
          isConnected: player.isConnected,
          lichessId: player.lichessId
        };
      }) : Seq()
  };
}

const actionCreators = {
  disconnectFromPlayerPool
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(PlayerPool);
