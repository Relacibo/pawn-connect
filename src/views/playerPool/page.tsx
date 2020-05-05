import React from 'react';
import PlayerPoolForm from './form';
import styles from './css/playerPool.css';
import Back from '../components/back';
import { ProgramState } from '@root/root/types';
import { ConnectedProps, connect } from 'react-redux';
import { PlayerState } from '@root/modules/playerPool/types/PlayerState';

const PlayerPool = (props: Props) => {
  return (
    <div>
      <Back />
      {!props.showPool ? (
        <div className={styles['player-pool-form']}><PlayerPoolForm /></div>
      ) : (
          <div>
            <table>
              <th>
                <td>Lichess ID</td>
                <td>Connected?</td>
              </th>{
                props.members?.map((player) => {
                  return (
                    <tr>
                      <td>{player.lichessId}</td>
                      <td>{player.isConnected}</td>
                    </tr>
                  );
                })
              }</table></div>
        )}
    </div>
  );
}
function mapStateToProps(state: ProgramState) {
  return {
    showPool: state.playerPool.playerPoolState != null,
    members: state.playerPool.playerPoolState?.members.valueSeq().map(
      player => {
        return {
          isConnected: player.isConnected,
          lichessId: player.lichessId
        };
      })
  };
}

const actionCreators = {

};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(PlayerPool);
