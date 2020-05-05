import React, { ChangeEvent, FormEvent } from "react";
import { ProgramState } from "@root/root/types";
import { connect, ConnectedProps } from "react-redux";
import styles from './css/playerPool.css';
import { connectToPlayer } from '@modules/playerPool/actions';
import { useHistory } from "react-router";
import routes from '@root/routes.json'

type State = {
  lichessId: string
}

class JoinForm extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
    this.state = { lichessId: '' };
    (this as any).handleChange = (this as any).handleChange.bind(this);
    (this as any).handleSubmit = (this as any).handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ ...this.state, lichessId: event.target.value });
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.props.connectToPlayer(this.state.lichessId);
    } catch (err) {
      return;
    }
    useHistory().push(routes.PLAYER_POOL);
  }

  render() {
    return (
      <form onSubmit={(this as any).handleSubmit}>
        <div>
          <label className={styles.label}>Lichess ID (host)</label>
          <input className={styles.input} value={this.state.lichessId} onChange={this.handleChange}></input>
        </div>
        <div>
          <input className={styles.submit} type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

function mapStateToProps(state: ProgramState) {
  return {

  };
}

const actionCreators = {
  connectToPlayer
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(JoinForm);
