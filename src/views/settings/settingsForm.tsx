/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */

/* eslint-disable react/destructuring-assignment */
import React, { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Map } from 'immutable';
import { ProgramState } from '../../root/types';
import { settingsStoreValue } from '../../modules/settings/actions';
import { LICHESS_TOKEN } from '../../modules/settings/enums/configKeys';

class SettingsForm extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
    const { config } = this.props;
    this.state = {
      ...this.state,
      config
    };
  }

  storeValue = (key: string, value: any) => {
    this.props.settingsStoreValue({
      key,
      value
    });
  };

  onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.storeValue(target.id, target.value);
    e.preventDefault();
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter': {
        const target = e.target as HTMLInputElement;
        this.storeValue(e.key, target.value);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { config } = this.state;
    this.setState(prevState => {
      return { ...prevState, config: config.set(target.id, target.value) };
    });
  };

  render() {
    return (
      <form className={this.state.className}>
        <label htmlFor={LICHESS_TOKEN}>
          Lichess Auth Token:
          <input
            id={LICHESS_TOKEN}
            type="text"
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.config.get(LICHESS_TOKEN) || ''}
          />
        </label>
      </form>
    );
  }
}

type State = { className: string; config: Map<string, any> };

function mapStateToProps(state: ProgramState) {
  return {
    config: state.settings.config
  };
}

const actionCreators = {
  settingsStoreValue
};

const connector = connect(mapStateToProps, actionCreators);
export type Props = ConnectedProps<typeof connector>;
export default connector(SettingsForm);
