/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { ProgramState } from '@root/root/types';
import {
  connectToPeer,
  disconnectFromPeer,
  sendMessageToPeer,
  initializePeer
} from '@modules/peer/actions';
import routes from '@root/routes.json';
import ConnectionStore from '@modules/peer/types/connectionStore';
import { CONNECTING } from '@root/modules/peer/enums/connectionState';

type State = {
  peerId: string;
  message: string;
  to: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class PeerConnectionTest extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      peerId: '',
      message: '',
      to: ''
    };
  }

  onConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.connectToPeer(this.state.peerId);
  };

  onSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.sendMessageToPeer(this.state.to, this.state.message);
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = (e.target as HTMLInputElement).value;
    this.setState(prevState => {
      return { ...prevState, [key]: value };
    });
  };

  render() {
    return (
      <div data-tid="container">
        <Link className="back-link" to={routes.HOME}>
          Back
        </Link>
        <h2>Peer Connection Playground</h2><div>
          {this.props.peerId && <span style={{ marginLeft: '5px' }}>Peer ID: {this.props.peerId}</span>}
        </div>
        <div>
          <input
            id="key"
            placeholder="connect key"
            onChange={(e) => this.onInputChange(e, 'peerId')}
            value={this.state.peerId}
          />
          <button type="button" onClick={this.onConnect}>
            Connect
          </button>
        </div>
        <div>
          <div>
            <input
              id="message"
              placeholder="Message text"
              onChange={(e) => this.onInputChange(e, 'message')}
              value={this.state.message}
            />
            <input
              id="to"
              placeholder="To"
              onChange={(e) => this.onInputChange(e, 'to')}
              value={this.state.to}
            />
            <button type="button" onClick={this.onSend}>
              Send
              </button>
          </div>
        </div>
        <table style={{ float: 'left', border: '1px solid white' }}><tbody>
          {this.props.receivedMessages
            .valueSeq()
            .map(({ id, connectionId, payload }) => {
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{connectionId}</td>
                  <td>{payload}</td>
                </tr>
              );
            })}
        </tbody></table>
        <table style={{ border: '1px solid white' }}><tbody>
          {this.props.connections.keySeq()
            .map(key => {
              const value = this.props.connections.get(key);
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value == CONNECTING ? (
                    <span style={{ color: 'yellow' }}>connecting...</span>
                  ) : (
                      <span style={{ color: 'green' }}>connected</span>
                    )}</td>
                </tr>
              );
            })}
        </tbody></table>
      </div>
    );
  }
}

function mapStateToProps(state: ProgramState) {
  const connection = (state.peer.connection as ConnectionStore);
  return {
    peerId: connection.peerId,
    connections: connection.connections,
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
