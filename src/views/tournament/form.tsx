import React from 'react';
import styles from './css/tournament.css'
import { ProgramState } from '@root/root/types';
import { connect, ConnectedProps } from 'react-redux';
import {connectToTournament, hostTournament} from '@modules/tournament/actions';

type State = {

}

class TournamentForm extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
  }
  render() { return (
    <div className={styles['button-group']}>
      <div className={styles.button}>Connect to Tournament</div>
      <div className={styles.button}>Host Tournament</div>
    </div>
  )}
}

function mapStateToProps(state: ProgramState) {
  return {
  };
}

const actionCreators = {

};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(TournamentForm);
