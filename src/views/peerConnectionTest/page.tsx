/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { ProgramState } from '../../root/types';
import {
  connectToPeer,
  disconnectFromPeer,
  sendMessageToPeer
} from '../../modules/peer/actions';
import routes from '../../root/routes.json';

type State = {
  key: string;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class PeerConnectionTest extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      key: '',
      message: ''
    };
  }

  onConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.key === '') {
      this.props.connectToPeer();
      return;
    }
    this.props.connectToPeer(this.state.key);
  };

  onSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.sendMessageToPeer(this.state.key, this.state.message);
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(prevState => {
      const obj: { [key: string]: string } = {};
      // eslint-disable-next-line react/no-access-state-in-setstate
      obj[this.state.key] = (e.target as HTMLInputElement).value;
      return { ...prevState, ...obj };
    });
  };

  render() {
    return (
      <div data-tid="container">
        <Link className="back-link" to={routes.HOME}>
          Back
        </Link>
        <div>
          <input
            id="key"
            placeholder="connect key"
            onChange={this.onInputChange}
            value={this.state.key}
          />
          <button type="button" onClick={this.onConnect}>
            Connect
          </button>
        </div>
        <div>
          <input
            id="message"
            placeholder="Message text"
            onChange={this.onInputChange}
            value={this.state.message}
          />
          <button type="button" onClick={this.onSend}>
            Send
          </button>
        </div>
        <table>
          {this.props.receivedMessages
            .valueSeq()
            .map(({ id, from, connectionId, payload }) => {
              return (
                <tr key={id}>
                  <td>{from}</td>
                  <td>{connectionId}</td>
                  <td>{payload}</td>
                </tr>
              );
            })}
        </table>
        <table>
          {this.props.connectionMap
            .valueSeq()
            .map(({ connectionId, state }) => {
              return (
                <tr key={connectionId}>
                  <td>{connectionId}</td>
                  <td>{state}</td>
                </tr>
              );
            })}
        </table>
      </div>
    );
  }
}

function mapStateToProps(state: ProgramState) {
  return {
    connectionMap: state.peer.connectionMap,
    receivedMessages: state.peer.messageStore.receivedMessages
  };
}

const actionCreators = {
  connectToPeer,
  disconnectFromPeer,
  sendMessageToPeer
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(PeerConnectionTest);
